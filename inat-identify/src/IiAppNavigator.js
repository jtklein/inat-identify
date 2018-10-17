import React from 'react';
import { createStackNavigator, createSwitchNavigator } from 'react-navigation';

import IiAuthScreen from './screens/IiAuthScreen';
import IiIdentifyScreen from './screens/IiIdentifyScreen';
import ItSettingsScreen from './screens/ItSettingsScreen';

import { colors } from './styles';

const { primaryColor } = colors;

const headerStyle = {
  backgroundColor: primaryColor
};
const headerTintColor = '#FFFFFF';
const headerTitleStyle = {
  fontWeight: 'bold'
};

const AuthStack = createStackNavigator(
  {
    Auth: IiAuthScreen
  },
  {
    initialRouteName: 'Auth',
    navigationOptions: {
      header: null,
      gesturesEnabled: false
    }
  }
);

const AppStack = createStackNavigator(
  {
    Identify: IiIdentifyScreen,
    Settings: ItSettingsScreen
  },
  {
    initialRouteName: 'Identify',
    navigationOptions: {
      headerStyle,
      headerTintColor,
      headerTitleStyle,
    }
  }
);

/**
 * The {@link SwitchNavigator} entry point of the entire app. Consists of launcher stack with
 * user authentication logic, and the main navigation object for the app.
 * @type {SwitchNavigator}
 */
const RootNavigator = createSwitchNavigator(
  // RouteConfigs
  {
    Auth: AuthStack,
    App: AppStack
  },
  // createSwitchNavigatorConfig
  {

    initialRoutName: 'Auth',
    resetOnBlur: true,
    backBehavior: 'none',
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
);


export default class IiAppNavigator extends React.Component {
  render() {
    return <RootNavigator />;
  }
}

