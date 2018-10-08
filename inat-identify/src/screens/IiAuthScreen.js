import React from 'react';
import { View, Text, Button } from 'react-native';
import oauth from '../../secrets/oauth';

const INATURALIST_OAUTH_API = 'https://www.inaturalist.org/oauth';

export default class IiAuthScreen extends React.Component {
  INITIAL_STATE = {
    result: null,
  };

  constructor(props) {
    super(props);
    this.state = this.INITIAL_STATE;
  }

  loginAsync = async () => {
  };

  render() {
    return (
      <ScrollView contentContainerStyle={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {this.state.result ? (
          <Text>{JSON.stringify(this.state.result)}</Text>
        ) : null}
        {this.state.accessToken ? (
          <Text>{JSON.stringify(this.state.accessToken)}</Text>
        ) : null}
        <Button
          title="Login with iNaturalist"
          onPress={() => this.loginAsync()}
        />
        <View style={{ height: 50 }} />
      </ScrollView>
    );
  }
}
