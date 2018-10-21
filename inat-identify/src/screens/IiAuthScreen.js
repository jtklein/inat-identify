import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Paragraph } from 'react-native-paper';
import { AuthSession } from 'expo';
import axios from 'axios';

import oauth from '../../secrets/oauth';
import { ItScreenContainer } from '../components/common';

const INATURALIST_OAUTH_API = 'https://www.inaturalist.org/oauth';

export default class IiAuthScreen extends React.Component {
  INITIAL_STATE = {
    isAuthenticating: false,
    result: null,
  };

  constructor(props) {
    super(props);
    this.state = this.INITIAL_STATE;
  }

  loginAsync = async () => {
    this.setState({ isAuthenticating: true });
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
          this.props.navigation.navigate('Entry', { apiToken: apiTokenResponse.data.api_token });
        }
        // TODO: UI response if no token received
      }
    }
    this.setState({ isAuthenticating: false });
  };

  render() {
    const { container, paragraph } = styles;
    return (
      <ItScreenContainer barStyle="dark-content">
        <View style={container}>
          <View style={paragraph}>
            <Paragraph>What can I do with this app?</Paragraph>
            <Paragraph>
            You will be able to identify a large batch of hitherto unknown observations.
            That's all. For now. If you like this feature, or have some requests, let me know.
            </Paragraph>
          </View>
          <View style={paragraph}>
            <Paragraph>How does it work?</Paragraph>
            <Paragraph>
            First, in order to use this app in combination with iNaturalist, you have to
            authenticate yourself on the iNaturalist homepage. This will give this app here the
            permission to send identifications made here back to iNaturalist on your behalf.
            In other words, all identifications will be performed with your user account.
            Once this was successfull you will be guided back here.
          </Paragraph>
        </View>
        <Button onPress={() => this.loginAsync()} loading={this.state.isAuthenticating}>
          Login with iNaturalist
          </Button>
          <View style={paragraph}>
            <Paragraph>Why do I see this screen every time?</Paragraph>
            <Paragraph>
            Handling your authentication with iNaturalist is a task that
            has to be done with utmost care. I made this app here in my spare time,
            and I have no time and resources to store your user account credentials securely enough
            within this app. For this reason, as of now, I am merely
            guiding you to iNaturalist's very own authentication and am not storing any
            of your credentials for future use.
            </Paragraph>
          </View>
          {true ? (
            <Button onPress={() => this.props.navigation.navigate(
              'Entry',
              {
                apiToken: oauth.MY_CURRENT_API_TOKEN,
              },
            )}
            >
            !!DEV Skip
            </Button>
          ) : null}
        </View>
      </ItScreenContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
  },
  paragraph: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
