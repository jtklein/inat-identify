import React, { Component } from 'react';
import { Modal, Button, StyleSheet, Text, View, Image } from 'react-native';

import inatjs from 'inaturalistjs';

export default class ItSettingsScreen extends Component {
  INITIAL_STATE = {
    apiToken: this.props.navigation.state.params.apiToken,
    swipeLeft: {
      id: 1,
      label: 'Animalia'
    },
    swipeRight: {
      id: 47126,
      label: 'Plantae'
    },
    swipeTop: {
      id: 51890,
      label: 'Crassulaceae'
    },
  };

  constructor(props) {
    super(props);
    this.state = this.INITIAL_STATE;
  }

  render() {
    const { navigation } = this.props;
    const { apiToken, swipeLeft, swipeRight, swipeTop } = this.state;
    return (
      <View style={styles.container}>
        <Text>Customize the swiper here:</Text>
        <Text>{apiToken}</Text>
        <Button
          title='Done'
          onPress={() => navigation.navigate('Identify', {
            apiToken,
            swipeLeft,
            swipeRight,
            swipeTop
          })}
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
});
