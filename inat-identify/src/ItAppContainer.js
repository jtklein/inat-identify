import React, { Component } from 'react';
import { View, BackHandler, Platform, StatusBar } from 'react-native';

import IiAppNavigator from './IiAppNavigator';

/**
 * Container for the entire app.
 * @type {Object}
 * @extends Component
 */
class ItAppContainer extends Component {
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
