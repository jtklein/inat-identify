import React from 'react';
import { createStackNavigator } from 'react-navigation';

import IiAuthScreen from './screens/IiAuthScreen';
import IiIdentifyScreen from './screens/IiIdentifyScreen';

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

