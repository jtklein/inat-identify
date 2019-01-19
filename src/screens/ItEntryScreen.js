import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Paragraph } from 'react-native-paper';

import {
  ItScreenContainer,
  ItHeaderButtons,
  HeaderItem,
} from '../components/common';

class ItEntryScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Swiper',
    headerRight: (
      <ItHeaderButtons>
        <HeaderItem testID="header_settings_button" title="settings" iconName="settings" onPress={() => navigation.navigate('Settings')} />
      </ItHeaderButtons>
    ),
  });

  INITIAL_STATE = {
    apiToken: this.props.navigation.state.params.apiToken,
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
        <View testID="entry_screen" style={container}>
          <View style={paragraph}>
            <Paragraph>How does it work?</Paragraph>
            <Paragraph>
              The app will show you a stack of cards. These are true iNaturalist
              observations, so don't mess around. In the basic example you can swipe right if you
              want to identify the observation as a plant, left for animal and up to the top for fungi.
              These represent the main branches of life and should suffice for now. You can always swipe
              to the bottom to skip an observation.
            </Paragraph>
            <Paragraph>
              Press on the image in the card to page through the images.
            </Paragraph>
            <Paragraph>
              For now, you can customize to a small extent in the settings menu (top right). You can change the place from
              where to look for observations. You can change the directions
              in which observations are identified into the three main branches of life. You can further set if you want to
              be subscribed to the observations you identified in each of the directions separately.
            </Paragraph>
            <Paragraph>
              If you like the app let me know, then I can make it so that you can customize the swipe directions even further.
            </Paragraph>
          </View>
          <Button testID="start_swiper" onPress={() => navigation.navigate('Identify', { apiToken })}>
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
    justifyContent: 'space-around',
  },
  paragraph: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ItEntryScreen;