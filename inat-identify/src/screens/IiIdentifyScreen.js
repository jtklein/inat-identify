import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';
import Swiper from 'react-native-deck-swiper';
import inatjs from 'inaturalistjs';

import ItObservationImages from '../components/features/ItObservationImages';
import { ItMaterial, ItScreenContainer } from '../components/common';

class IiIdentifyScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: (
        <ItMaterial
          onPress={() => navigation.navigate('Settings')}
          name="settings"
          color="#FFFFFF"
        />
      ),
    };
  };

  INITIAL_STATE = {
    user: {},
    apiToken: this.props.navigation.state.params.apiToken,
    swipedAllCards: false,
    swipeDirection: '',
    isSwipingBack: false,
    cardIndex: 0,
    observations: [],
    page: 0,
  };

  constructor(props) {
    super(props);
    this.state = this.INITIAL_STATE;
  }

  componentDidMount = async () => {
    // TODO: refactor to app start up, if we ever have different screens
    const user = await this.getCurrentUser();
    console.log('user', user);
    if(user) {
      // Get first batch of unidentified observations
      this.searchObservations();
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.swiper !== nextProps.swiper) {
      return false;
    }
    return true;
  }


  searchObservations() {
    const { user } = this.state;
    const { place } = this.props.swiper;
    const params = {
      iconic_taxa: 'unknown',
      quality_grade: 'needs_id',
      per_page: 100,
      page: this.state.page + 1,
      // Must be observed within the place with this ID
      // Testing with Europe
      place_id: place.id,
      // Observations have been reviewed by the user with ID equal to the value of the viewer_id parameter
      viewer_id: user.id,
      reviewed: 'false',
      photos: 'true'
    };

    inatjs.observations
      .search(params)
      .then(rsp => {
        const filteredResults = rsp.results.filter(d => !d.species_guess);
        this.setState({ observations: filteredResults, page: rsp.page });
      })
      .catch(e => {
        console.log('Error in fetching list of observations', e);
        console.log(e.response);
      });
  }

  getCurrentUser = async () => {
    const { apiToken } = this.state;
    const options = { api_token: apiToken };
    return await inatjs.users.me(options)
      .then(r => {
        this.setState({ user: r.results[0] });
        return r;
      })
      // TODO: UI response
      .catch(e => {
        console.log('Error in fetching current user', e);
        console.log(e.response);
      });
  }

  onSwipedAllCards = () => {
    this.setState({
      observations: [],
      swipedAllCards: true
    });
    // Get new batch of unidentified observation
    this.searchObservations();
  };

  swipeBack = () => {
    if (!this.state.isSwipingBack) {
      this.setIsSwipingBack(true, () => {
        this.swiper.swipeBack(() => {
          this.setIsSwipingBack(false);
        });
      });
    }
  };

  setIsSwipingBack = (isSwipingBack, cb) => {
    this.setState(
      {
        isSwipingBack: isSwipingBack
      },
      cb
    );
  };

  identifyInAnimationFrame(observation, swipeOption) {
    requestAnimationFrame(() => {
      this.identify(observation, swipeOption);
    });
  }

  identify(observation, swipeOption) {
    console.log('observation', observation);
    const { apiToken } = this.state;
    /*
    {
      "identification": {
        "observation_id": 0,
        "taxon_id": 0,
        "current": true,
        "body": "string"
      }
    }
    */
    const identification = {
      identification:
      {
        observation_id: observation.id,
        taxon_id: swipeOption.id
      }
    };
    const options = { api_token: apiToken };
    inatjs.identifications
      .create(identification, options)
      .then(c => {
        console.log('identification', c);
        if (!swipeOption.subscribe) {
          inatjs.observations.subscribe(observation, options)
            .then(rsp => console.log('Unsubscriped to: ', rsp))
            .catch(e => {
              console.log('Error in unsubscribing to observation', e);
              console.log(e.response);
            });
        }
      })
      .catch(e => {
        console.log('Error in creating identification', e);
        console.log(e.response);
      });
  }

  onSwipedLeft(observation) {
    const { swipeLeft } = this.props.swiper;
    // Use set id for this identification
    this.identifyInAnimationFrame(observation, swipeLeft);
  }

  onSwipedRight(observation) {
    const { swipeRight } = this.props.swiper;
    // Use set id for this identification
    this.identifyInAnimationFrame(observation, swipeRight);
  }

  onSwipedTop(observation) {
    const { swipeTop } = this.props.swiper;
    // Use set id for this identification
    this.identifyInAnimationFrame(observation, swipeTop);
  }

  onSwipedBottom(observation) {
    // Nothing to do here, as this is the skip option
  }

  renderCard = (observation, index) => {
    const { text, card } = styles;
    return <View style={card}>
      <Text style={text} >{observation.observation_photos.length}</Text>
      <Text style={text} >{observation.species_guess}</Text>
      <Text style={text} >{observation.identifications_count > 0 ? observation.identifications_count : null}</Text>
      <Text style={text} >{observation.description}</Text>
      <ItObservationImages observation={observation} />
    </View>;
  };

  render() {
    const { observations, cardIndex } = this.state;
    const { swipeLeft, swipeRight, swipeTop } = this.props.swiper;
    const { label } = styles;
    if (!observations) {
      return null;
    }
    return (
      <ItScreenContainer>
        <Swiper
          cards={observations}
          cardIndex={cardIndex}
          ref={swiper => { this.swiper = swiper }}
          backgroundColor={'#FFFFFF'}
          renderCard={this.renderCard}
          cardVerticalMargin={20}
          stackSize={3}
          stackSeparation={8}
          stackScale={10}
          onSwipedLeft={(index) => this.onSwipedLeft(observations[index])}
          onSwipedRight={(index) => this.onSwipedRight(observations[index])}
          onSwipedTop={(index) => this.onSwipedTop(observations[index])}
          onSwipedBottom={(index) => this.onSwipedBottom(observations[index])}
          onSwipedAll={this.onSwipedAllCards}
          overlayLabels={{
            bottom: {
              title: 'Skip',
              style: {
                label,
                wrapper: {
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }
              }
            },
            left: {
              title: swipeLeft.label,
              style: {
                label,
                wrapper: {
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  justifyContent: 'flex-start',
                  marginTop: 30,
                  marginLeft: -30
                }
              }
            },
            right: {
              title: swipeRight.label,
              style: {
                label,
                wrapper: {
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                  marginTop: 30,
                  marginLeft: 30
                }
              }
            },
            top: {
              title: swipeTop.label,
              style: {
                label,
                wrapper: {
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }
              }
            }
          }}
          animateOverlayLabelsOpacity
          animateCardOpacity
        />
      </ItScreenContainer>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#E8E8E8',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  label: {
    backgroundColor: 'black',
    borderColor: 'black',
    color: 'white',
    borderWidth: 1
  },
  text: {
    color: 'red'
  }
});

const mapStateToProps = (state) => ({
  swiper: state.swiper,
});

export default connect(mapStateToProps, undefined)(IiIdentifyScreen);