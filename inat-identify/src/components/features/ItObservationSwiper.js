import React, { Component } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import ItSwiper from './swiper/ItSwiper';

import ItObservationImages from './ItObservationImages';

class ItObservationSwiper extends Component {
  renderCard = (observation, index) => {
    const { card, text } = styles;
    if (!observation) {
      return null;
    }
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
      onSwipedAll
    } = this.props;
    const { swipeLeft, swipeRight, swipeTop } = this.props.swiper;
    const { label } = styles;
    return (
      <ItSwiper
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
        onSwipedAll={onSwipedAll}
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
      />
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

export default ItObservationSwiper;
