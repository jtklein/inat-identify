import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { connect } from 'react-redux';

import IiAuthScreen from './screens/IiAuthScreen';

import ItEntryScreen from './screens/ItEntryScreen';
import IiIdentifyScreen from './screens/IiIdentifyScreen';
import ItSettingsScreen from './screens/ItSettingsScreen';
import ItSupportScreen from './screens/ItSupportScreen';

import {
  ItHeaderButtons,
  HeaderItem,
} from './components/common';

import { colors } from './styles';

const { primaryColor } = colors;

const headerStyle = {
  backgroundColor: primaryColor,
};
const headerTintColor = '#FFFFFF';
const headerTitleStyle = {
  fontWeight: 'bold',
};

// /**
//  * The {@link SwitchNavigator} entry point of the entire app. Consists of launcher stack with
//  * user authentication logic, and the main navigation object for the app.
//  * @type {SwitchNavigator}
//  */
// const RootNavigator = createSwitchNavigator(
//   // RouteConfigs
//   {
//     Auth: AuthStack,
//     App: AppStack,
//   },
//   // createSwitchNavigatorConfig
//   {
//     initialRoutName: 'Auth',
//     resetOnBlur: true,
//     backBehavior: 'none',
//     defaultNavigationOptions: {
//       headerShown: false,
//       gestureEnabled: false,
//     },
//   },
// );

const AppStack = createNativeStackNavigator();

class App extends Component {
  render() {
    const { auth } = this.props;
    const { signedIn } = auth;
    return (
      <NavigationContainer>
        <AppStack.Navigator
          initialRouteName={'Auth'}
          screenOptions={{
            headerStyle,
            headerTintColor,
            headerTitleStyle,
          }}>
          {signedIn ? (
            <>
              <AppStack.Screen
                name="Entry"
                component={ItEntryScreen}
                options={({ navigation }) => ({
                  title: 'Swiper',
                  headerRight: () => (
                    <ItHeaderButtons>
                      <HeaderItem
                        testID="header_settings_button"
                        title="settings"
                        iconName="more-horiz"
                        onPress={() => navigation.navigate('Settings')}
                      />
                    </ItHeaderButtons>
                  ),
                })}
              />
              <AppStack.Screen
                name="Settings"
                component={ItSettingsScreen}
                options={{ title: 'Extras' }}
              />
              <AppStack.Screen
                name="Support"
                component={ItSupportScreen}
                options={{ title: 'Support' }}
              />
              <AppStack.Screen
                name="Identify"
                component={IiIdentifyScreen}
                options={({ route }) => ({ title: 'title' })}
                // options={({ route }) => ({ title: route.params.title })}
              />
            </>
          ) : (
            <>
              <AppStack.Screen
                name="Auth"
                component={IiAuthScreen}
                options={{
                  headerShown: false,
                  gestureEnabled: false,
                }}
              />
            </>
          )}
        </AppStack.Navigator>
      </NavigationContainer>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
