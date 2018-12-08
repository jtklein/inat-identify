import React, { Component } from 'react';
import { StyleSheet, View, Image, TouchableWithoutFeedback } from 'react-native';

class ItObservationImages extends Component {
  INITIAL_STATE = {
    currentIndex: 0,
    uri: this.props.observation.observation_photos[0].photo.url.replace(
      'square',
      'large',
    ),
  };

  constructor(props) {
    super(props);
    this.state = this.INITIAL_STATE;
  }

  onImagePressed() {
    const { observation } = this.props;
    const { currentIndex } = this.state;
    let newIndex = currentIndex + 1;
    if (newIndex >= observation.observation_photos.length) {
      newIndex = 0;
    }

    // The Observation has only thumbnails of images
    const uri = observation.observation_photos[newIndex].photo.url.replace('square', 'large');
    console.log(uri);
    this.setState({ currentIndex: newIndex, uri });
  }

  render() {
    const { uri } = this.state;
    const { observation } = this.props;
    const {
      containerStyle,
      image,
    } = styles;
    return (
      <TouchableWithoutFeedback style={containerStyle} onPress={() => this.onImagePressed()}>
        <View style={StyleSheet.absoluteFill}>
          <Image style={image} source={{ uri }} />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    paddingLeft: 1,
    paddingRight: 1
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: null,
    height: null,
  },
});

export default ItObservationImages;
