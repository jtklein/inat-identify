import React, { Component } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { PanGestureHandler, State, TapGestureHandler } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

import ItSwiperCard from './ItSwiperCard';

function runSpring(clock, value, dest) {
  const state = {
    finished: new Value(0),
    velocity: new Value(0),
    position: new Value(0),
    time: new Value(0),
  };
  const config = {
    tension: 60,
    speed: 14,
    damping: 20,
    mass: 1,
    stiffness: 100,
    overshootClamping: false,
    restSpeedThreshold: 1,
    restDisplacementThreshold: 0.5,
    toValue: new Value(0),
  };
  return [
    cond(clockRunning(clock), 0, [
      set(state.finished, 0),
      set(state.velocity, 0),
      set(state.position, value),
      set(config.toValue, dest),
      startClock(clock),
    ]),
    spring(clock, state, config),
    cond(state.finished, stopClock(clock)),
    state.position,
  ];
}

const { width, height } = Dimensions.get('window');
const toRadians = angle => angle * (Math.PI / 180);
const rotatedWidth = width * Math.sin(toRadians(90 - 15)) + height * Math.sin(toRadians(15));
const {
  add,
  multiply,
  neq,
  spring,
  cond,
  eq,
  event,
  lessThan,
  greaterThan,
  and,
  call,
  set,
  clockRunning,
  startClock,
  stopClock,
  Clock,
  Value,
  concat,
  interpolate,
  Extrapolate,
} = Animated;

class ItSwiper extends Component {
  constructor(props) {
    super(props);
    const { observations } = props;
    this.state = { observations };
    this.translationX = new Value(0);
    this.translationY = new Value(0);
    this.velocityX = new Value(0);
    this.velocityY = new Value(0);
    this.offsetY = new Value(0);
    this.offsetX = new Value(0);
    this.gestureState = new Value(State.UNDETERMINED);
    this.onGestureEvent = event(
      [
        {
          nativeEvent: {
            translationX: this.translationX,
            translationY: this.translationY,
            velocityX: this.velocityX,
            velocityY: this.velocityY,
            state: this.gestureState,
          },
        },
      ],
      { useNativeDriver: true },
    );
    this.init();
  }

  init = () => {
    const clockX = new Clock();
    const clockY = new Clock();
    const {
      translationX,
      translationY,
      velocityX,
      velocityY,
      gestureState,
      offsetY,
      offsetX,
    } = this;
    gestureState.setValue(State.UNDETERMINED);
    translationX.setValue(0);
    translationY.setValue(0);
    velocityX.setValue(0);
    velocityY.setValue(0);
    offsetY.setValue(0);
    offsetX.setValue(0);

    const finalTranslateX = add(translationX, multiply(0.2, velocityX));
    const translationThresholdX = width / 4;
    const snapPointX = cond(
      lessThan(finalTranslateX, -translationThresholdX),
      -rotatedWidth,
      cond(greaterThan(finalTranslateX, translationThresholdX), rotatedWidth, 0),
    );

    const finalTranslateY = add(translationY, multiply(0.5, velocityY));
    const translationThresholdY = height / 4;
    const snapPointY = cond(
      lessThan(finalTranslateY, -translationThresholdY),
      -rotatedWidth,
      cond(greaterThan(finalTranslateY, translationThresholdY), rotatedWidth, 0),
    );

    // TODO: handle case where the user drags the card again before the spring animation finished
    this.translateY = cond(
      eq(gestureState, State.END),
      [
        set(translationY, runSpring(clockY, translationY, snapPointY)),
        set(offsetY, translationY),
        cond(and(eq(clockRunning(clockY), 0), neq(translationY, 0)), [
          call([translationY], this.onVerticalSwiped),
        ]),
        translationY,
      ],
      cond(eq(gestureState, State.BEGAN), [stopClock(clockY), translationY], translationY),
    );

    this.translateX = cond(
      eq(gestureState, State.END),
      [
        set(translationX, runSpring(clockX, translationX, snapPointX)),
        set(offsetX, translationX),
        cond(and(eq(clockRunning(clockX), 0), neq(translationX, 0)), [
          call([translationX], this.onHorizontalSwiped),
        ]),
        translationX,
      ],
      cond(eq(gestureState, State.BEGAN), [stopClock(clockX), translationX], translationX),

    );
  };

  onHorizontalSwiped = ([translationX]) => {
    const { observations: [topObservation, ...observations] } = this.state;
    const {
      onSwipedLeft,
      onSwipedRight,
      onSwipedAll,
    } = this.props;
    const goesDown = translationX > 0;
    if (goesDown) {
      onSwipedRight(topObservation);
    } else {
      onSwipedLeft(topObservation);
    }
    if (observations.length === 0) {
      onSwipedAll();
    }
    this.setState({ observations }, this.init);
  }

  onVerticalSwiped = ([translationY]) => {
    const { observations: [topObservation, ...observations] } = this.state;
    const {
      onSwipedTop,
      onSwipedBottom,
      onSwipedAll,
    } = this.props;
    const goesBottom = translationY > 0;
    if (goesBottom) {
      onSwipedBottom(topObservation);
    } else {
      onSwipedTop(topObservation);
    }
    if (observations.length === 0) {
      onSwipedAll();
    }
    this.setState({ observations }, this.init);
  }

  onTap = (event) => {
  };

  render() {
    const { onGestureEvent, translateX, translateY } = this;
    const { observations: [topObservation, ...observations] } = this.state;
    const { swiper } = this.props;
    const { cards } = styles;

    const leftOpacity = interpolate(translateX, {
      inputRange: [-width / 2, 0],
      outputRange: [1, 0],
    });
    const rightOpacity = interpolate(translateX, {
      inputRange: [0, width / 2],
      outputRange: [0, 1],
    });
    const topOpacity = interpolate(translateY, {
      inputRange: [-height / 2, 0],
      outputRange: [1, 0],
    });
    const bottomOpacity = interpolate(translateY, {
      inputRange: [0, height / 2],
      outputRange: [0, 1],
    });

    const rotateZ = concat(
      interpolate(translateX, {
        inputRange: [-width / 2, width / 2],
        outputRange: [15, -15],
        extrapolate: Extrapolate.CLAMP,
      }),
      'deg',
    );

    const style = {
      ...StyleSheet.absoluteFillObject,
      zIndex: 900,
      transform: [
        { translateX },
        { translateY },
        { rotateZ },
      ],
    };

    return (
      <View style={cards}>
        {
          observations.reverse().map(observation => (
            <ItSwiperCard
              key={observation.id}
              swiper={swiper}
              {...{ observation }}
            />
          ))
        }
        <PanGestureHandler
          onHandlerStateChange={onGestureEvent}
          {...{ onGestureEvent }}
        >
          <Animated.View {...{ style }}>
            <TapGestureHandler
              onHandlerStateChange={this.onTap}
            >
              <Animated.View {...{ style }}>
                <ItSwiperCard
                  swiper={swiper}
                  observation={topObservation}
                  imageIndex={imageIndex}
                  {...{
                    rightOpacity,
                    leftOpacity,
                    topOpacity,
                    bottomOpacity,
                  }}
                />
              </Animated.View>
            </TapGestureHandler>
          </Animated.View>
        </PanGestureHandler>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cards: {
    flex: 1,
    zIndex: 100,
  },
});

export default ItSwiper;
