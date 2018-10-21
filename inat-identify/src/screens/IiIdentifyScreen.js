import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';
import Swiper from 'react-native-deck-swiper';
import inatjs from 'inaturalistjs';

import ItObservationImages from '../components/features/ItObservationImages';
import {
  ItScreenContainer,
  ItSpinner,
} from '../components/common';

class IiIdentifyScreen extends Component {
  static navigationOptions = ({ navigation }) => ({ title: navigation.getParam('title') });

  INITIAL_STATE = {
    user: {},
    apiToken: this.props.navigation.state.params.apiToken,
    swipeDirection: '',
    cardIndex: 0,
    observations: [],
    page: 0,
  };

  constructor(props) {
    super(props);
    this.state = this.INITIAL_STATE;
  }

  componentDidMount = async () => {
    const { navigation, swiper } = this.props;
    const { place } = swiper;
    navigation.setParams({ title: place.label });
    // TODO: refactor to app start up, if we ever have different screens
    const user = await this.getCurrentUser();
    console.log('user', user);
    if (user) {
      // Get first batch of unidentified observations
      this.searchObservations();
    }
  };

  shouldComponentUpdate(nextProps, nextState) {
    const { swiper } = this.props;
    if (swiper !== nextProps.swiper) {
      return false;
    }
    return true;
  }

  onSwipedLeft(index) {
    const { observations } = this.state;
    const { swiper } = this.props;
    const { swipeLeft } = swiper;
    this.setState({ cardIndex: index + 1 });
    // Use set id for this identification
    this.identifyInAnimationFrame(observations[index], swipeLeft);
  }

  onSwipedRight(index) {
    const { observations } = this.state;
    const { swiper } = this.props;
    const { swipeRight } = swiper;
    this.setState({ cardIndex: index + 1 });
    // Use set id for this identification
    this.identifyInAnimationFrame(observations[index], swipeRight);
  }

  onSwipedTop(index) {
    const { observations } = this.state;
    const { swiper } = this.props;
    const { swipeTop } = swiper;
    this.setState({ cardIndex: index + 1 });
    // Use set id for this identification
    this.identifyInAnimationFrame(observations[index], swipeTop);
  }

  onSwipedBottom(index) {
    this.setState({ cardIndex: index + 1 });
    // Nothing to do here, as this is the skip option
  }

  onSwipedAllCards = () => {
    this.setState({ observations: [] });
    // Get new batch of unidentified observation
    this.searchObservations();
  };

  getCurrentUser = async () => {
    const { apiToken } = this.state;
    const options = { api_token: apiToken };
    return await inatjs.users
      .me(options)
      .then((r) => {
        this.setState({ user: r.results[0] });
        return r;
      })
      // TODO: UI response
      .catch((e) => {
        console.log('Error in fetching current user', e);
        console.log(e.response);
      });
  };

  searchObservations() {
    const { user, page } = this.state;
    const { swiper } = this.props;
    const { place } = swiper;
    const params = {
      iconic_taxa: 'unknown',
      quality_grade: 'needs_id',
      per_page: 100,
      page: page + 1,
      // Must be observed within the place with this ID
      place_id: place.id,
      // Observations have been reviewed by the user with ID equal to the value of the viewer_id parameter
      viewer_id: user.id,
      reviewed: 'false',
      photos: 'true',
    };

    inatjs.observations
      .search(params)
      .then((rsp) => {
        const filteredResults = rsp.results.filter(d => !d.species_guess);
        this.setState({
          observations: filteredResults,
          page: rsp.page,
          cardIndex: 0,
        });
      })
      .catch((e) => {
        console.log('Error in fetching list of observations', e);
        console.log(e.response);
      });
  }

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
      identification: {
        observation_id: observation.id,
        taxon_id: swipeOption.id,
      },
    };
    const options = { api_token: apiToken };
    inatjs.identifications
      .create(identification, options)
      .then((c) => {
        console.log('identification', c);
        if (!swipeOption.subscribe) {
          inatjs.observations
            .subscribe(observation, options)
            .then(rsp => console.log('Unsubscriped to: ', rsp))
            .catch((e) => {
              console.log('Error in unsubscribing to observation', e);
              console.log(e.response);
            });
        }
      })
      .catch((e) => {
        console.log('Error in creating identification', e);
        console.log(e.response);
      });
  }

  renderAdditionalInfo = () => {
    const { cardIndex, observations } = this.state;
    const observation = observations[cardIndex];
    const { additionalInfoContainer, text } = styles;
    if (!observation) {
      return null;
    }

    return (
      <View style={additionalInfoContainer}>
        <Text style={text}>{cardIndex}</Text>
        <Text style={text}>{observation.observation_photos.length}</Text>
        <Text style={text}>{observation.species_guess}</Text>
        <Text style={text}>
          {observation.identifications_count > 0
            ? observation.identifications_count
            : null}
        </Text>
        <Text style={text}>{observation.description}</Text>
      </View>
    );
  };

  renderCard = (observation, index) => {
    const { card } = styles;
    return (
      <View style={card}>
        <ItObservationImages observation={observation} />
      </View>
    );
  };

  render() {
    const { observations, cardIndex } = this.state;
    const { swipeLeft, swipeRight, swipeTop } = this.props.swiper;
    const { label } = styles;
    if (!observations || !observations.length > 0) {
      return <ItSpinner />;
    }
    return (
      <ItScreenContainer>
        <Swiper
          cards={observations}
          cardIndex={cardIndex}
          ref={(swiper) => {
            this.swiper = swiper;
          }}
          marginBottom={60}
          backgroundColor="#FFFFFF"
          renderCard={this.renderCard}
          cardVerticalMargin={20}
          stackSize={3}
          stackSeparation={8}
          stackScale={10}
          onSwipedLeft={index => this.onSwipedLeft(index)}
          onSwipedRight={index => this.onSwipedRight(index)}
          onSwipedTop={index => this.onSwipedTop(index)}
          onSwipedBottom={index => this.onSwipedBottom(index)}
          onSwipedAll={this.onSwipedAllCards}
          overlayLabels={{
            bottom: {
              title: 'Skip',
              style: {
                label,
                wrapper: {
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                },
              },
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
                  marginLeft: -30,
                },
              },
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
                  marginLeft: 30,
                },
              },
            },
            top: {
              title: swipeTop.label,
              style: {
                label,
                wrapper: {
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                },
              },
            },
          }}
          animateOverlayLabelsOpacity
          animateCardOpacity
        >
          {this.renderAdditionalInfo()}
        </Swiper>
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
    backgroundColor: 'white',
  },
  label: {
    backgroundColor: 'black',
    borderColor: 'black',
    color: 'white',
    borderWidth: 1,
  },
  text: {
    color: 'red',
  },
  additionalInfoContainer: {
    alignItems: 'center',
  },
});

const mapStateToProps = state => ({
  swiper: state.swiper,
});

export default connect(mapStateToProps, undefined)(IiIdentifyScreen);
