import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { Button, Paragraph } from 'react-native-paper';

import {
  ItScreenContainer,
  ItHeaderButtons,
  HeaderItem
} from '../components/common';

class ItEntryScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Swiper',
      headerRight: (
        <ItHeaderButtons>
          <HeaderItem title='settings' iconName='settings' onPress={() => navigation.navigate('Settings')} />
        </ItHeaderButtons>
      )
    };
  };

  INITIAL_STATE = {
    apiToken: this.props.navigation.state.params.apiToken
  };

  constructor(props) {
    super(props);
    this.state = this.INITIAL_STATE;
  }

  render() {
    const { navigation } = this.props;
    const { apiToken } = this.state;
    const { container, paragraph } = styles;
    return (
      <ItScreenContainer>
        <View style={container}>
          <View style={paragraph}>
            <Paragraph>How does it work?</Paragraph>
            <Paragraph>
              The app will show you a stack of cards. These are true iNaturalist
              observations, so don't mess around. In the basic example you can swipe right if you
              want identify the observation as a plant, left for animal and up to the top for fungi.
              These represent the main branches of life and should suffice for now.
              If you like the app let me know, then I can make it so that you can customize the swipe directions.
            </Paragraph>
          </View>
          <Button onPress={() => navigation.navigate('Identify', { apiToken })}>
            OK, got it
          </Button>
        </View>
      </ItScreenContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around'
  },
  paragraph: {
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default ItEntryScreen;
