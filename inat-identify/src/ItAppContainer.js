import React, { Component } from 'react';
import { View, BackHandler } from 'react-native';
import { NavigationActions } from 'react-navigation';
import inatjs from 'inaturalistjs';

import IiAppNavigator from './IiAppNavigator';

// inatjs.setConfig({
//   apiHost: 'gorilla.inaturalist.org',
//   writeApiHost: 'gorilla.inaturalist.org'
// });

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
        <IiAppNavigator />
      </View>
    );
  }
}

export default ItAppContainer;
