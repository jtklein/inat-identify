import React from 'react';
import { createStackNavigator } from 'react-navigation';

import IiAuthScreen from './screens/IiAuthScreen';
import IiIdentifyScreen from './screens/IiIdentifyScreen';
import ItSettingsScreen from './screens/ItSettingsScreen';

const RootStack = createStackNavigator(
  {
    Auth: IiAuthScreen,
    Settings: ItSettingsScreen,
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

