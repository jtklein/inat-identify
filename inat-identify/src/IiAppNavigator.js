import React from 'react';
import { Button, View, Text } from 'react-native';
import { createStackNavigator } from 'react-navigation';

import IiAuthScreen from './screens/IiAuthScreen';
import IiIdentifyScreen from './screens/IiIdentifyScreen';

class HomeScreen extends React.Component {
  }
}

const RootStack = createStackNavigator(
  {
    Auth: IiAuthScreen,
    Identify: IiIdentifyScreen
  },
  {
    initialRouteName: 'Auth'
  }
);

export default class IiAppNavigator extends React.Component {
  render() {
    return <RootStack />;
  }
}

