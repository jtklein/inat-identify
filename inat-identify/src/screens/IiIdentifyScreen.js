import React, { Component } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import Swiper from 'react-native-deck-swiper';

import inatjs from 'inaturalistjs';

export default class IiIdentifyScreen extends Component {
  INITIAL_STATE = {
    user: {},
    apiToken: this.props.navigation.state.params.apiToken,
    swipeLeft: this.props.navigation.state.params.swipeLeft,
    swipeRight: this.props.navigation.state.params.swipeRight,
    swipeTop: this.props.navigation.state.params.swipeTop,
    place: this.props.navigation.state.params.place,
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

  searchObservations() {
    const { user, place } = this.state;
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
        taxon_id: swipeOption.id,
        body: 'Hej, sorry about the low-level identification. Am trying out an experimental identification app.'
      }
    };
    const options = { api_token: apiToken };
    inatjs.identifications
      .create(identification, options)
      .then(c => {
        console.log('identification', c);
      })
      .catch(e => {
        console.log('Error in creating identification', e);
        console.log(e.response);
      });
  }

  onSwipedLeft(observation) {
    const { swipeLeft } = this.state;
    // Use set id for this identification
    this.identify(observation, swipeLeft);
  }

  onSwipedRight(observation) {
    const { swipeRight } = this.state;
    // Use set id for this identification
    this.identify(observation, swipeRight);
  }

  onSwipedTop(observation) {
    const { swipeTop } = this.state;
    // Use set id for this identification
    this.identify(observation, swipeTop);
  }

  onSwipedBottom(observation) {
    // Nothing to do here, as this is the skip option
  }

  renderCard = (observation, index) => {
    // The Observation has only thumbnails of images
    const uri = observation.observation_photos[0].photo.url.replace('square', 'large');
    return <View style={styles.card}>
      <Text style={{ color: 'red' }} >{observation.observation_photos.length}</Text>
      <Text style={{ color: 'red' }} >{observation.species_guess}</Text>
      <Text style={{ color: 'red' }} >{observation.identifications_count > 0 ? observation.identifications_count : null}</Text>
      <Text style={{ color: 'red' }} >{observation.description}</Text>
      <Image resizeMode="contain" style={{ flex: 1 }} source={{ uri }} />
    </View>;
  };

  render() {
    const { observations, cardIndex, swipeLeft, swipeRight, swipeTop } = this.state;
    const { container, label } = styles;
    if (!observations) {
      return null;
    }
    return (
      <View style={container}>
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
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
  }
});