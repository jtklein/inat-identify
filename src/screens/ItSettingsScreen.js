import React, { Component } from 'react';
import {
  Share,
  Linking,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { connect } from 'react-redux';
import { List } from 'react-native-paper';

import { ItScreenContainer } from '../components/common';

import { colors } from '../styles';

const { disabledColor, textColor } = colors;

class ItSettingsScreen extends Component {
  INITIAL_STATE = {
  };

  constructor(props) {
    super(props);
    this.state = this.INITIAL_STATE;
  }

  shareLink = (ids) => {
    const baseURL = 'https://www.inaturalist.org/observations/identify?reviewed=any&quality_grade=needs_id%2Cresearch%2Ccasual&id=';
    const url = `${baseURL}${ids}`;
    Share.share({ url })
      .then((result) => {
        if (result.action === Share.sharedAction) {
          if (result.activityType) {
            // shared with activity type of result.activityType
          } else {
            // shared
          }
        } else if (result.action === Share.dismissedAction) {
          // dismissed
        }
      })
      .catch((error) => console.log(error.message));
  }

  openLink = (ids) => {
    const baseURL = 'https://www.inaturalist.org/observations/identify?reviewed=any&quality_grade=needs_id%2Cresearch%2Ccasual&id=';
    const url = `${baseURL}${ids}`;
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Don't know how to open URI", url);
      }
    });
  }

  render() {
    const { navigation, skippedObservations } = this.props;
    const noSkippedObservations = (skippedObservations.length === 0);
    const noSkippedObservationsColor = noSkippedObservations ? disabledColor : textColor;
    return (
      <ItScreenContainer>
        <List.Item
          title="Open skipped observations in browser"
          titleStyle={{ color: noSkippedObservationsColor }}
          left={(props) => <List.Icon {...props} color={noSkippedObservationsColor} string icon="open-in-app" />}
          onPress={() => this.openLink(skippedObservations)}
          disabled={noSkippedObservations}
        />
        <List.Item
          title="Share skipped observations"
          titleStyle={{ color: noSkippedObservationsColor }}
          left={(props) => <List.Icon {...props} color={noSkippedObservationsColor} icon="share" />}
          onPress={() => this.shareLink(skippedObservations)}
          disabled={noSkippedObservations}
        />
        <List.Item
          title="Privacy policy"
          onPress={() => WebBrowser.openBrowserAsync(
            'https://www.inaturalist.org/journal/jtklein/24285-privacy-policy-for-inat-toolcat',
          )}
        />
        <List.Item
          title="Support"
          onPress={() => navigation.navigate('Support')}
        />
      </ItScreenContainer>
    );
  }
}

const mapStateToProps = state => ({
  skippedObservations: state.observations.skippedObservations,
});

export default connect(mapStateToProps, {})(ItSettingsScreen);
