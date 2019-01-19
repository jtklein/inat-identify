import React, { Component } from 'react';
import { View } from 'react-native';

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
        <IiAppNavigator />
      </View>
    );
  }
}

export default ItAppContainer;
