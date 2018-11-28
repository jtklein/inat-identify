// @flow
import * as React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import Animated from 'react-native-reanimated';

import ItObservationImages from './ItObservationImages';

const { Value } = Animated;

type CardProps = {
  swiper: {
    swipeLeft: {},
    swipeRight: {},
    swipeTop: {}
  },
  observation: {},
  rightOpacity?: Value | number,
  leftOpacity?: Value | number,
  topOpacity?: Value | number,
  bottomOpacity?: Value | number,
};

export default class ItSwiperCard extends React.PureComponent<CardProps> {
  static defaultProps = {
    rightOpacity: 0,
    leftOpacity: 0,
    topOpacity: 0,
    bottomOpacity: 0
  };

  render() {
    const {
      swiper,
      observation,
      rightOpacity,
      leftOpacity,
      topOpacity,
      bottomOpacity,
    } = this.props;
    const {
      labelContainer,
      label,
      topLabels,
      pager,
      pagerIndicator,
    } = styles;
    const { swipeLeft, swipeRight, swipeTop } = swiper;
    return (
      <View style={StyleSheet.absoluteFill}>
        <Image style={styles.image} source={{ uri: observation.observation_photos[0].photo.url.replace('square', 'large') }} />
        <View style={styles.overlay}>
          <View style={styles.header}>
            <View style={pager}>
              {observation.observation_photos.length > 1 ? observation.observation_photos.map((p, index) => <View key={p.id} style={index === 0 ? pagerIndicator : [pagerIndicator, { backgroundColor: '#BBBBBB' }]} />) : null}
            </View>
            <View style={topLabels}>
              <Animated.View style={[labelContainer, { opacity: rightOpacity }]}>
                <Text style={label}>{swipeRight.label}</Text>
              </Animated.View>
              <Animated.View style={[labelContainer, { opacity: leftOpacity }]}>
                <Text style={label}>{swipeLeft.label}</Text>
              </Animated.View>
            </View>
          </View>
          <View style={styles.centre}>
            <Animated.View style={[labelContainer, { opacity: bottomOpacity }]}>
              <Text style={label}>Skip</Text>
            </Animated.View>
            <Animated.View style={[labelContainer, { opacity: topOpacity }]}>
              <Text style={label}>{swipeTop.label}</Text>
            </Animated.View>
          </View>
          <View style={styles.footer}>
            <Text style={styles.name}>{observation.name}</Text>
            {observation.description ? <Text style={styles.name}>{`Description: ${observation.description}`}</Text> : null}
            {observation.identifications_count > 0 ? <Text style={styles.name}>This observation already has some identifications</Text> : null}
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    ...StyleSheet.absoluteFillObject,
    width: null,
    height: null,
    borderRadius: 8
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 16
  },
  header: {
    flexDirection: 'column',
    justifyContent: 'flex-start'
  },
  topLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  pager: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  pagerIndicator: {
    flex: 1,
    height: 8,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 2,
    borderRadius: 8
  },
  centre: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  footer: {
    flexDirection: 'row'
  },
  name: {
    color: 'white',
    fontSize: 32
  },
  labelContainer: {
    borderWidth: 4,
    borderRadius: 5,
    padding: 8,
    borderColor: '#000000',
    backgroundColor: '#000000'
  },
  label: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: 'bold'
  }
});
