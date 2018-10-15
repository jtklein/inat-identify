import React, { Component } from 'react';
import { View, BackHandler, Platform, StatusBar } from 'react-native';
import { NavigationActions } from 'react-navigation';

import IiAppNavigator from './IiAppNavigator';

/**
 * Container for the entire app.
 * @type {Object}
 * @extends Component
 */
class ItAppContainer extends Component {
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
  }

  onBackPress = () => {
    const { nav } = this.props;
    if (nav.index === 0) {
      return false;
    }
    NavigationActions.back();
    return true;
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" />}
        <IiAppNavigator />
      </View>
    );
  }
}

export default ItAppContainer;
