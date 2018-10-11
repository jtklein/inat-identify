import React, { Component } from 'react';
import { Modal, Button, StyleSheet, Text, View, Image } from 'react-native';

import inatjs from 'inaturalistjs';

export default class ItSettingsScreen extends Component {
  INITIAL_STATE = {
    apiToken: this.props.navigation.state.params.apiToken,
  };

  constructor(props) {
    super(props);
    this.state = this.INITIAL_STATE;
  }

  render() {
    const { navigation } = this.props;
    const { apiToken } = this.state;
    return (
      <View style={styles.container}>
        <Text>Customize the swiper here:</Text>
        <Text>{apiToken}</Text>
        <Button
          title='Done'
          onPress={() => navigation.navigate('Identify', { apiToken })}
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
