import React from 'react';
import { View, Text, Button } from 'react-native';

export default class IiAuthScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Auth Screen</Text>
        <Button
          title="Go to Identify"
          onPress={() => this.props.navigation.navigate('Identify')}
        />
      </View>
    );
  }
}
