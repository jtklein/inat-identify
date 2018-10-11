import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { Button } from 'react-native-paper';
import { AuthSession } from 'expo';
import axios from 'axios';

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
    // AuthFlow is handled by Expo.AuthSession
    let redirectUrl = AuthSession.getRedirectUrl();
    let result = await AuthSession.startAsync({
      authUrl:
        `${INATURALIST_OAUTH_API}/authorize?response_type=code` +
        `&client_id=${oauth.INATURALIST_APP_ID}` +
        `&redirect_uri=${encodeURIComponent(redirectUrl)}`
    });
    console.log('result', result);
    this.setState({ result });
    // The code was successfully retrieved
    // TODO: UI for result.type === 'cancel | dismissed | error'
    if (result.type && result.type === 'success') {
      const url = `${INATURALIST_OAUTH_API}/token`;
      const params = {
        client_id: oauth.INATURALIST_APP_ID,
        client_secret: oauth.INATURALIST_APP_SECRET,
        code: result.params.code,
        redirect_uri: AuthSession.getRedirectUrl(),
        grant_type: "authorization_code",
      }
      // POST request to the iNaturalist OAuth API
      let response = await axios
        .post(url, params)
        .catch(error => {
          console.log(
            "Error in fetching access token from iNaturalist",
            error
          );
          return { error };
        });
      console.log('response', response);
      // Response OK
      // TODO: UI for failure
      if (response.status === 200) {
        this.setState({ accessToken: response.data.access_token });

        // Get the API token required to make API calls for the user
        const url = 'https://www.inaturalist.org/users/api_token.json';
        const config = { 
          headers: {
            'Authorization': 'Bearer ' + response.data.access_token
        }};
        const apiTokenResponse =  await axios.get(url, config)
          .then(r => r)
          .catch(e => {
            console.log('Error in fetching API token from iNaturalist', e);
            return { error };
          });
        console.log('apiTokenResponse', apiTokenResponse);
        if (apiTokenResponse.data && apiTokenResponse.data.api_token) {
          // Navigate to next screen with api_token
          this.props.navigation.navigate('Identify', { apiToken: apiTokenResponse.data.api_token });
        }
        // TODO: UI response if no token received
      }
    }
  };

  render() {
    return <ScrollView contentContainerStyle={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {this.state.result ? <Text>
            {JSON.stringify(this.state.result)}
          </Text> : null}
        {this.state.accessToken ? <Text>
            {JSON.stringify(this.state.accessToken)}
          </Text> : null}
        <Button onPress={() => this.loginAsync()}>
          Login with iNaturalist
        </Button>
        <Button onPress={() => this.props.navigation.navigate(
            'Settings',
            { apiToken: 'No token' }
          )}
        >
          !!DEV Skip
        </Button>

        <View style={{ height: 50 }} />
      </ScrollView>;
  }
}
