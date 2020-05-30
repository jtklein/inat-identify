import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Share,
  Linking,
  ScrollView,
} from 'react-native';
import { Button, Paragraph } from 'react-native-paper';
import { connect } from 'react-redux';

import {
  ItScreenContainer,
} from '../components/common';

class ItEntryScreen extends Component {
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
      .catch(error => console.log(error.message));
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
    const { paragraph } = styles;
    return (
      <ItScreenContainer>
        <ScrollView testID="entry_screen">
          <View style={paragraph}>
            <Paragraph>How does it work?</Paragraph>
            <Paragraph>
              The app will show you a stack of cards. These are true
              iNaturalist observations, so don't mess around. In the basic
              example you can swipe right if you want to identify the
              observation as a plant, left for animal and up to the top for
              fungi. These represent the main branches of life and should
              suffice for now. You can always swipe to the bottom to skip an
              observation.
            </Paragraph>
            <Paragraph>
              Press on the image in the card to page through the images.
            </Paragraph>
            <Paragraph>
              For now, you can customize to a small extent in the settings
              menu (top right). You can change the place from where to look
              for observations. You can change the directions in which
              observations are identified into the three main branches of
              life. You can further set if you want to be subscribed to the
              observations you identified in each of the directions
              separately.
            </Paragraph>
            <Paragraph>
              If you like the app let me know, then I can make it so that
              you can customize the swipe directions even further.
            </Paragraph>
          </View>
          <Button
            testID="start_swiper"
            onPress={() => navigation.navigate('Identify')}
          >
            OK, got it
          </Button>
          <View style={paragraph}>
            <Paragraph>
              If you are finished for this session come back here and you
              can send yourself a link with the skipped observations to open
              those on the iNaturalist website.
            </Paragraph>
            <Button
              testID="open_link"
              icon="open-in-app"
              onPress={() => this.openLink(skippedObservations)}
              disabled={skippedObservations.length === 0}
            >
              Open in browser
            </Button>
            <Button
              testID="share_link"
              icon="share"
              onPress={() => this.shareLink(skippedObservations)}
              disabled={skippedObservations.length === 0}
            >
              Share the link
            </Button>
          </View>
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
  skippedObservations: state.observations.skippedObservations,
});

export default connect(mapStateToProps, undefined)(ItEntryScreen);
