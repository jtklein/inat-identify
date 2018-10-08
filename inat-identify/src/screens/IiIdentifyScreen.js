import React, { Component } from 'react';
import { Button, StyleSheet, Text, View, Image } from 'react-native';
import Swiper from 'react-native-deck-swiper';

import inatjs from 'inaturalistjs';

export default class IiIdentifyScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      swipedAllCards: false,
      swipeDirection: '',
      isSwipingBack: false,
      cardIndex: 0,
      observations: [],
      page: 0,
    };
  }

  componentDidMount() {
    // Get first batch of unidentified observations
    this.searchObservations();
  }

  searchObservations() {
    const params = {
      iconic_taxa: 'unknown',
      quality_grade: 'needs_id',
      per_page: 100,
      page: this.state.page + 1,
      // Must be observed within the place with this ID
      // Testing with Europe
      place_id: 97391,
      viewer_id: 530659,
      // Observations have been reviewed by the user with ID equal to the value of the viewer_id parameter
      reviewed: 'false',
      photos: 'true'
    };

    inatjs.observations
      .search(params)
      .then(rsp => {
        console.log('observations search', rsp);
        this.setState({ observations: rsp.results, page: rsp.page });
      })
      .catch(e => {
        console.log('Error:', e);
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

  identify(observation, taxon_id) {
    console.log('observation', observation);
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
        taxon_id,
      }
    };
    inatjs.identifications
      .create(identification, token)
      .then(c => {
        console.log('identification', c);
      })
      .catch(e => {
        console.log('Error:', e);
      });
  }

  onSwipedLeft(observation) {
    console.log('observation', observation);
    // Hardcoded to kingdom Animalia
    this.identify(observation, 1);
  }

  onSwipedRight(observation) {
    console.log('observation', observation);
    // Hardcoded to kingdom Plantae
    this.identify(observation, 47126);
  }

  onSwipedTop(observation) {
    console.log('observation', observation);
    // Hardcoded to family Crassulaceae
    // TODO: this id should not mark as reviewed
    // this.identify(observation, 1);
  }

  onSwipedBottom(observation) {
    // Nothing to do here, as this is the skip option
    console.log('observation', observation);
  }

  renderCard = (observation, index) => {
    // The Observation has only thumbnails of images
    const uri = observation.observation_photos[0].photo.url.replace('square', 'large');
    return <View style={styles.card}>
        <Image resizeMode="contain" style={{ flex: 1 }} source={{ uri }} />
        <Text style={{ color: 'red' }} >{observation.species_guess}</Text>
        <Text style={{ color: 'red' }} >{observation.identifications_count > 0 ? observation.identifications_count : null}</Text>
        <Text style={{ color: 'red' }} >{observation.description}</Text>
      </View>;
  };

  render() {
    const { observations } = this.state;
    if (!observations) {
      return null;
    }
    return (
      <View style={styles.container}>
        <Swiper
          cards={this.state.observations}
          cardIndex={this.state.cardIndex}
          ref={swiper => { this.swiper = swiper }}
          backgroundColor={'#FFFFFF'}
          renderCard={this.renderCard}
          cardVerticalMargin={80}
          stackSize={3}
          stackSeparation={15}
          onSwipedLeft={(index) => this.onSwipedLeft(observations[index])}
          onSwipedRight={(index) => this.onSwipedRight(observations[index])}
          onSwipedTop={(index) => this.onSwipedTop(observations[index])}
          onSwipedBottom={(index) => this.onSwipedBottom(observations[index])}
          onSwipedAll={this.onSwipedAllCards}
          overlayLabels={{
            bottom: {
              title: 'Skip',
              style: {
                label: {
                  backgroundColor: 'black',
                  borderColor: 'black',
                  color: 'white',
                  borderWidth: 1
                },
                wrapper: {
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }
              }
            },
            left: {
              title: 'Animalia',
              style: {
                label: {
                  backgroundColor: 'black',
                  borderColor: 'black',
                  color: 'white',
                  borderWidth: 1
                },
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
              title: 'Plantae',
              style: {
                label: {
                  backgroundColor: 'black',
                  borderColor: 'black',
                  color: 'white',
                  borderWidth: 1
                },
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
              title: 'Crassulaceae',
              style: {
                label: {
                  backgroundColor: 'black',
                  borderColor: 'black',
                  color: 'white',
                  borderWidth: 1
                },
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
  done: {
    textAlign: 'center',
    fontSize: 30,
    color: 'white',
    backgroundColor: 'transparent'
  }
});