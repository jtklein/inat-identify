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
    };
  }

  componentDidMount() {
    const params = {
      iconic_taxa: 'unknown',
      quality_grade: 'needs_id',
      // Must be observed within the place with this ID
      // Testing with Europe
      place_id: 97391,
      reviewed: 'false',
      photos: 'true'
    };

    inatjs.observations
      .search(params)
      .then(rsp => {
        console.log('observations search', rsp);
        this.setState({ observations: rsp.results });
      })
      .catch(e => {
        console.log('Error:', e);
      });
  }

  onSwipedAllCards = () => {
    this.setState({
      swipedAllCards: true
    });
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

  onSwipedLeft(observation) {
    console.log('observation', observation);
  }

  onSwipedRight(observation) {
    console.log('observation', observation);

  }

  onSwipedTop(observation) {
    console.log('observation', observation);

  }

  onSwipedBottom(observation) {
    console.log('observation', observation);

  }

  renderCard = (observation, index) => {
    // The Observation has only thumbnails of images
    const uri = observation.observation_photos[0].photo.url.replace('square', 'large');
    return (
      <View style={styles.card}>
        <Image
          resizeMode='contain'
          style={{ flex: 1 }}
          source={{ uri }}
        />
      </View>
    );
  };

  render() {
    const { observations } = this.state;
    if (!observations) {
      return null;
    }
    return (
      <View style={styles.container}>
        <Swiper
          ref={swiper => {
            this.swiper = swiper;
          }}
          backgroundColor={'#FFFFFF'}
          onSwipedLeft={(index) => this.onSwipedLeft(observations[index])}
          onSwipedRight={(index) => this.onSwipedRight(observations[index])}
          onSwipedTop={(index) => this.onSwipedTop(observations[index])}
          onSwipedBottom={(index) => this.onSwipedBottom(observations[index])}
          cards={this.state.observations}
          cardIndex={this.state.cardIndex}
          cardVerticalMargin={80}
          renderCard={this.renderCard}
          onSwipedAll={this.onSwipedAllCards}
          stackSize={3}
          stackSeparation={15}
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
    backgroundColor: '#F5FCFF'
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