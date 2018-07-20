import React from 'react';
import { Button, View, Text } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import IiAuthScreen from './screens/IiAuthScreen';
class HomeScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Home Screen</Text>
        <Button
          title="Go to Details"
          onPress={() => this.props.navigation.navigate('Auth')}
        />
      </View>
    );
  }
}

const RootStack = createStackNavigator(
  {
    Auth: IiAuthScreen,
    Home: HomeScreen
  },
  {
    initialRouteName: 'Home'
  }
);

export default class IiAppNavigator extends React.Component {
  render() {
    return <RootStack />;
  }
}

