import React, { Component } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import Swiper from 'react-native-deck-swiper';

import ItObservationImages from './ItObservationImages';

class ItSwiper extends Component {
  renderAdditionalInfo = () => {
    const { swiper, observations, cardIndex } = this.props;
    const { maxPhotos } = swiper;
    const observation = observations[cardIndex];
    const { additionalInfoContainer, text } = styles;
    if (!observation || maxPhotos === 1) {
      return null;
    }

    return (
      <View style={additionalInfoContainer}>
        <Text style={text}>{`Number of photos: ${observation.observation_photos.length}`}</Text>
      </View>
    );
  };

  renderCard = (observation, index) => {
    const { card, text } = styles;
    return (
      <View style={card}>
        {observation.description ? <Text style={text}>{`Description: ${observation.description}`}</Text> : null}
        {observation.identifications_count > 0 ? <Text style={text}>This observation already has some identifications</Text> : null}
        <ItObservationImages observation={observation} />
      </View>
    );
  };

  render() {
    const {
      observations,
      cardIndex,
      onSwipedLeft,
      onSwipedRight,
      onSwipedTop,
      onSwipedBottom,
      onSwipedAllCards
    } = this.props;
    const { swipeLeft, swipeRight, swipeTop } = this.props.swiper;
    const { label } = styles;
    return (
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
        onSwipedLeft={index => onSwipedLeft(index)}
        onSwipedRight={index => onSwipedRight(index)}
        onSwipedTop={index => onSwipedTop(index)}
        onSwipedBottom={index => onSwipedBottom(index)}
        onSwipedAll={onSwipedAllCards}
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
  },
  additionalInfoContainer: {
    alignItems: 'center'
  }
});

export default ItSwiper;
