import {
  createSwitchNavigator,
  createAppContainer,
} from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import IiAuthScreen from './screens/IiAuthScreen';

import ItEntryScreen from './screens/ItEntryScreen';
import IiIdentifyScreen from './screens/IiIdentifyScreen';
import ItSettingsScreen from './screens/ItSettingsScreen';

import { colors } from './styles';

const { primaryColor } = colors;

const headerStyle = {
  backgroundColor: primaryColor,
};
const headerTintColor = '#FFFFFF';
const headerTitleStyle = {
  fontWeight: 'bold',
};

const AuthStack = createStackNavigator(
  {
    Auth: IiAuthScreen,
  },
  {
    initialRouteName: 'Auth',
    defaultNavigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
);

const AppStack = createStackNavigator(
  {
    Entry: ItEntryScreen,
    Settings: ItSettingsScreen,
    Identify: IiIdentifyScreen,
  },
  {
    initialRouteName: 'Entry',
    defaultNavigationOptions: {
      headerStyle,
      headerTintColor,
      headerTitleStyle,
    },
  },
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
    App: AppStack,
  },
  // createSwitchNavigatorConfig
  {
    initialRoutName: 'Auth',
    resetOnBlur: true,
    backBehavior: 'none',
    defaultNavigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
);

export default IiAppNavigator = createAppContainer(RootNavigator);
