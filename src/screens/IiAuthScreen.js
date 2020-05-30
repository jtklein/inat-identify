import React from 'react';
import {
  Alert,
  StyleSheet,
  View,
  ScrollView,
} from 'react-native';
import { Button, Paragraph } from 'react-native-paper';
import { connect } from 'react-redux';
import * as AuthSession from 'expo-auth-session';
import axios from 'axios';

import oauth from '../../secrets/oauth';
import api from '../../secrets/api_token';
import { ItScreenContainer } from '../components/common';

import {
  SIGNED_IN,
} from '../actions/types';

const INATURALIST_OAUTH_API = 'https://www.inaturalist.org/oauth';

class IiAuthScreen extends React.Component {
  INITIAL_STATE = {
    isAuthenticating: false,
  };

  constructor(props) {
    super(props);
    this.state = this.INITIAL_STATE;
  }

  loginAsync = async () => {
    const { signIn } = this.props;

    this.setState({ isAuthenticating: true });
    // AuthFlow is handled by Expo.AuthSession
    const redirectUrl = AuthSession.getRedirectUrl();
    const result = await AuthSession.startAsync({
      authUrl:
        `${INATURALIST_OAUTH_API}/authorize?response_type=code`
        + `&client_id=${oauth.INATURALIST_APP_ID}`
        + `&redirect_uri=${encodeURIComponent(redirectUrl)}`,
    });
    console.log('result', result);
    // The code was successfully retrieved
    if (result.type && result.type === 'success') {
      const tokenUrl = `${INATURALIST_OAUTH_API}/token`;
      const params = {
        client_id: oauth.INATURALIST_APP_ID,
        client_secret: oauth.INATURALIST_APP_SECRET,
        code: result.params.code,
        redirect_uri: AuthSession.getRedirectUrl(),
        grant_type: 'authorization_code',
      };
      // POST request to the iNaturalist OAuth API
      const response = await axios
        .post(tokenUrl, params)
        .catch((error) => {
          console.log(
            'Error in fetching access token from iNaturalist',
            error,
          );
          return { error };
        });
      console.log('response', response);
      // Response OK
      if (response.status === 200) {
        // Get the API token required to make API calls for the user
        const apiTokenUrl = 'https://www.inaturalist.org/users/api_token.json';
        const config = {
          headers: {
            Authorization: `Bearer ${response.data.access_token}`,
          },
        };
        const apiTokenResponse = await axios.get(apiTokenUrl, config)
          .then(r => r)
          .catch((e) => {
            console.log('Error in fetching API token from iNaturalist', e);
            return { error: e };
          });
        console.log('apiTokenResponse', apiTokenResponse);
        if (apiTokenResponse.data && apiTokenResponse.data.api_token) {
          // Navigate to next screen with api_token
          signIn(apiTokenResponse.data.api_token);
        } else {
          // Show alert for failure of getting api token
          Alert.alert(
            'The login was giving an error',
            'Unfortunately, you can not proceed',
          );
        }
      } else {
        // Show alert for failure of getting oauth token
        Alert.alert(
          'The login was giving an error',
          'Unfortunately, you can not proceed',
        );
      }
    } else {
      // The auth session was unsuccessful
      if (result.type === 'cancel') {
        Alert.alert(
          'The login was canceled',
          'You need to login to iNaturalist to proceed',
        );
      }
      if (result.type === 'dismissed') {
        Alert.alert(
          'The login was dismissed',
          'Unfortunately, you can not proceed',
        );
      }
      if (result.type === 'error') {
        Alert.alert(
          'The login was giving an error',
          'Unfortunately, you can not proceed',
        );
      }
    }
    this.setState({ isAuthenticating: false });
  };

  render() {
    const { signIn } = this.props;
    const { isAuthenticating } = this.state;
    const { paragraph } = styles;
    return (
      <ItScreenContainer barStyle="dark-content">
        <ScrollView testID="auth_screen">
          <View style={paragraph}>
            <Paragraph>What can I do with this app?</Paragraph>
            <Paragraph>
            You will be able to identify a large batch of hitherto unknown observations.
            That is all. For now. If you like this feature, or have some requests, let me know.
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
          <Button
            testID="login_button"
            onPress={() => this.loginAsync()}
            loading={isAuthenticating}
          >
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
          {__DEV__ ? (
            <Button
              testID="dev_skip_login"
              onPress={() => signIn(api.api_token)}
            >
              !!DEV Skip
            </Button>
          ) : null}
        </ScrollView>
      </ItScreenContainer>
    );
  }
}

const styles = StyleSheet.create({
  paragraph: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const mapStateToProps = state => ({
  auth: state.auth,
});

const mapDispatchToProps = dispatch => ({
  signIn: (payload) => {
    dispatch({ type: SIGNED_IN, payload });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(IiAuthScreen);
