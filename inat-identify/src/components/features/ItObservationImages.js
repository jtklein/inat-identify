import React, { Component } from 'react';
import { StyleSheet, Image, TouchableWithoutFeedback } from 'react-native';

class ItObservationImages extends Component {
  INITIAL_STATE = {
    currentIndex: 0,
    uri: this.props.observation.observation_photos[0].photo.url.replace(
      'square',
      'large'
    )
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
    const uri = this.props.observation.observation_photos[newIndex].photo.url.replace('square', 'large');
    console.log(uri);
    this.setState({ currentIndex: newIndex, uri });
  }

  render() {
    const { uri } = this.state;
    const { containerStyle, image } = styles;
    return (
      <TouchableWithoutFeedback style={containerStyle} onPress={() => this.onImagePressed()}>
        <Image style={image} source={{ uri }} resizeMode="contain" />
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
    flex: 1
  }
});

export default ItObservationImages;