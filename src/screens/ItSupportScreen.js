import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Linking,
} from 'react-native';
import { connect } from 'react-redux';
import { Button, Headline, Caption, Paragraph } from 'react-native-paper';

import { ItScreenContainer } from '../components/common';
import { colors } from '../styles';

const { primaryColor } = colors;

class ItSupportScreen extends Component {
  INITIAL_STATE = {
  };

  constructor(props) {
    super(props);
    this.state = this.INITIAL_STATE;
  }

  openForum = () => {
    const url = 'https://forum.inaturalist.org/t/am-looking-for-some-test-users-of-an-identification-app/430';
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Don't know how to open URI", url);
      }
    });
  }

  render() {
    const { headline, paragraph } = styles;
    return (
      <ItScreenContainer>
        <View style={{ flex: 1, justifyContent: 'space-around' }}>
          <View style={paragraph}>
            <Headline style={headline}>Want to report a bug?</Headline>
            <Button
              testID="patreon"
              onPress={() => this.openForum()}
            >
              Join the forum
            </Button>
          </View>
        </View>
      </ItScreenContainer>
    );
  }
}

const styles = StyleSheet.create({
  headline: {
    alignItems: 'center',
    justifyContent: 'center',
    color: primaryColor,
    fontSize: 32,
    textAlign: 'center',
  },
});

const mapStateToProps = state => ({
  skippedObservations: state.observations.skippedObservations,
});

export default connect(mapStateToProps, {})(ItSupportScreen);
