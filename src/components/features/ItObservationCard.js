import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, TouchableWithoutFeedback } from 'react-native';
import { Button, Dialog, Portal } from 'react-native-paper';

import { ItMaterial } from '../common';

class ItObservationCard extends Component {
  INITIAL_STATE = {
    currentIndex: 0,
    uri: this.props.observation.observation_photos[0].photo.url.replace(
      'square',
      'large'
    ),
    commentsVisible: false
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
    const uri = observation.observation_photos[newIndex].photo.url.replace(
      'square',
      'large'
    );
    console.log(uri);
    this.setState({ currentIndex: newIndex, uri });
  }

  showDialog = () => {
    this.setState({ commentsVisible: true });
  };

  hideDialog = () => {
    this.setState({ commentsVisible: false });
  };

  renderCommentsModal() {
    const { commentsVisible } = this.state;
    const { observation } = this.props;
    return (
      <Portal>
        <Dialog visible={commentsVisible} onDismiss={this.hideDialog}>
          <Dialog.Title>Comments</Dialog.Title>
          <Dialog.Content>
            {observation.comments.map((c) => <Text key={c.id}>{`@${c.user.login}: ${c.body}`}</Text>)}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={this.hideDialog}>OK</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    );
  }

  render() {
    const { currentIndex, uri } = this.state;
    const { observation } = this.props;
    const {
      containerStyle,
      overlay,
      image,
      pager,
      pagerIndicator,
      text,
    } = styles;
    return (
      <TouchableWithoutFeedback
        style={containerStyle}
        onPress={() => this.onImagePressed()}
      >
        <View style={StyleSheet.absoluteFill}>
          <Image style={image} source={{ uri }} />
          <View style={overlay}>
            <View style={pager}>
              {observation.observation_photos.length > 1
                ? observation.observation_photos.map((p, index) => (
                  <View
                    key={p.id}
                    style={
                      index === currentIndex
                        ? pagerIndicator
                        : [pagerIndicator, { backgroundColor: '#BBBBBB' }]
                    }
                  />
                ))
                : null}
            </View>
            {observation.description ? (
              <Text style={text}>
                {`Description: ${observation.description}`}
              </Text>
            ) : null}
            {observation.identifications_count > 0 ? (
              <Text style={text}>
                This observation already has some identifications
              </Text>
            ) : null}
            {observation.comments_count > 0 ? (
              <View>
                <ItMaterial
                  name="comment"
                  size={48}
                  color="#FFFFFF"
                  onPress={() => this.showDialog()}
                />
                {this.renderCommentsModal()}
              </View>
            ) : null}
          </View>
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
    borderRadius: 8,
    width: null,
    height: null
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 16
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
  text: {
    color: 'white',
    fontSize: 32
  }
});

export default ItObservationCard;
