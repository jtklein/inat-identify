import React, { Component } from 'react';
import { Picker, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';

import inatjs from 'inaturalistjs';

const taxa = [
  {
    id: 1,
    label: 'Animalia'
  },
  {
    id: 47126,
    label: 'Plantae'
  },
  {
    id: 47170,
    label: 'Fungi'
  }
];

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
          onPress={() => navigation.navigate('Identify', {
            apiToken,
            swipeLeft,
            swipeRight,
            swipeTop
          })}
        >
          Done
        </Button>
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
