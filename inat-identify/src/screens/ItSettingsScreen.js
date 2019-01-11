import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { Switch, List, Button } from 'react-native-paper';

import { ItScreenContainer } from '../components/common';
import {
  SWIPER_LEFT_CHANGED,
  SWIPER_RIGHT_CHANGED,
  SWIPER_TOP_CHANGED,
  SWIPER_PLACE_CHANGED,
  SWIPER_LEFT_SUBSCRIBED,
  SWIPER_LEFT_UNSUBSCRIBED,
  SWIPER_RIGHT_UNSUBSCRIBED,
  SWIPER_RIGHT_SUBSCRIBED,
  SWIPER_TOP_UNSUBSCRIBED,
  SWIPER_TOP_SUBSCRIBED,
  SWIPER_PHOTOS_CHANGED,
} from '../actions/types';

const places = [
  {
    id: 97389,
    label: 'South America',
  },
  {
    id: 97391,
    label: 'Europe',
  },
  {
    id: 97392,
    label: 'Africa',
  },
  {
    id: 97393,
    label: 'Oceania',
  },
  {
    id: 97394,
    label: 'North America',
  },
  {
    id: 97395,
    label: 'Asia',
  },
];

const taxa = [
  {
    id: 1,
    label: 'Animalia',
    subscribe: true,
  },
  {
    id: 47126,
    label: 'Plantae',
    subscribe: true,
  },
  {
    id: 47170,
    label: 'Fungi',
    subscribe: true,
  },
];

const photosOptions = [
  {
    value: 1,
    label: '1',
  },
  {
    value: Infinity,
    label: 'More than one',
  },
];

class ItSettingsScreen extends Component {
  static navigationOptions = () => ({
    title: 'Swiper settings',
  });

  INITIAL_STATE = {
    showFilter: true,
  };

  constructor(props) {
    super(props);
    this.state = this.INITIAL_STATE;
  }

  onFilterPressed = () => {
    this.setState({ showFilter: true });
  }

  onActionsPressed = () => {
    this.setState({ showFilter: false });
  }

  renderFilterSettings = () => {
    const {
      changeSwipePlace,
      changeSwipePhotos,
      swiper,
    } = this.props;
    const { place, maxPhotos } = swiper;
    const { container } = styles;
    return (
      <View style={container}>
        <List.Accordion
          title={`by place = ${place.label}`}
          left={props => <List.Icon {...props} icon="place" />}
        >
          {places.map(p => (
            <List.Item
              key={p.id}
              title={p.label}
              onPress={() => changeSwipePlace(p)}
            />
          ))}
        </List.Accordion>
        <List.Accordion
          title={`by number photos = ${maxPhotos}`}
          left={props => <List.Icon {...props} icon="photo" />}
        >
          {photosOptions.map(p => (
            <List.Item
              key={p.label}
              title={p.label}
              onPress={() => changeSwipePhotos(p)}
            />
          ))}
        </List.Accordion>
      </View>
    );
  }

  renderActionsSettings = () => {
    const {
      changeSwipeLeft,
      subscribeSwipeLeft,
      unsubscribeSwipeLeft,
      changeSwipeRight,
      subscribeSwipeRight,
      unsubscribeSwipeRight,
      changeSwipeTop,
      subscribeSwipeTop,
      unsubscribeSwipeTop,
      swiper,
    } = this.props;
    const {
      swipeLeft, swipeRight, swipeTop,
    } = swiper;

    const { container, subscriptionContainer } = styles;
    return (
      <View style={container}>
        <List.Accordion
          title={`Swipe left = ${swipeLeft.label}`}
          left={props => <List.Icon {...props} icon="keyboard-arrow-left" />}
        >
          {taxa.map(taxon => (
            <List.Item
              key={taxon.id}
              title={taxon.label}
              onPress={() => changeSwipeLeft(taxon)}
            />
          ))}
        </List.Accordion>
        <View style={subscriptionContainer}>
          <Text>{`Subscribe to ${swipeLeft.label} identifications`}</Text>
          <Switch
            testID="subscribe_left"
            value={swipeLeft.subscribe}
            onValueChange={() => (swipeLeft.subscribe
              ? unsubscribeSwipeLeft()
              : subscribeSwipeLeft())
            }
          />
        </View>

        <List.Accordion
          title={`Swipe right = ${swipeRight.label}`}
          left={props => <List.Icon {...props} icon="keyboard-arrow-right" />}
        >
          {taxa.map(taxon => (
            <List.Item
              key={taxon.id}
              title={taxon.label}
              onPress={() => changeSwipeRight(taxon)}
            />
          ))}
        </List.Accordion>
        <View style={subscriptionContainer}>
          <Text>{`Subscribe to ${swipeRight.label} identifications`}</Text>
          <Switch
            testID="subscribe_right"
            value={swipeRight.subscribe}
            onValueChange={() => (swipeRight.subscribe
              ? unsubscribeSwipeRight()
              : subscribeSwipeRight())
            }
          />
        </View>

        <List.Accordion
          title={`Swipe top = ${swipeTop.label}`}
          left={props => <List.Icon {...props} icon="keyboard-arrow-up" />}
        >
          {taxa.map(taxon => (
            <List.Item
              key={taxon.id}
              title={taxon.label}
              onPress={() => changeSwipeTop(taxon)}
            />
          ))}
        </List.Accordion>
        <View style={subscriptionContainer}>
          <Text>{`Subscribe to ${swipeTop.label} identifications`}</Text>
          <Switch
            testID="subscribe_top"
            value={swipeTop.subscribe}
            onValueChange={() => (swipeTop.subscribe ? unsubscribeSwipeTop() : subscribeSwipeTop())
            }
          />
        </View>
      </View>
    );
  }

  renderSettings = () => {
    const { showFilter } = this.state;
    return showFilter ? this.renderFilterSettings() : this.renderActionsSettings();
  }

  render() {
    const { showFilter } = this.state;
    const { container } = styles;
    return (
      <ItScreenContainer>
        <View testID="settings_screen" style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
          <Button testID="filter_tab" icon="filter-list" mode={showFilter ? 'contained' : 'outlined'} onPress={() => this.onFilterPressed()}>
            Filter
          </Button>
          <Button testID="actions_tab" icon="open-with" mode={!showFilter ? 'contained' : 'outlined'} onPress={() => this.onActionsPressed()}>
            Actions
          </Button>
        </View>
        <View style={container}>
          {this.renderSettings()}
        </View>
      </ItScreenContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  subscriptionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

const mapStateToProps = state => ({
  swiper: state.swiper,
});

const mapDispatchToProps = dispatch => ({
  changeSwipeLeft: (payload) => {
    dispatch({ type: SWIPER_LEFT_CHANGED, payload });
  },
  subscribeSwipeLeft: (payload) => {
    dispatch({ type: SWIPER_LEFT_SUBSCRIBED, payload });
  },
  unsubscribeSwipeLeft: (payload) => {
    dispatch({ type: SWIPER_LEFT_UNSUBSCRIBED, payload });
  },
  changeSwipeRight: (payload) => {
    dispatch({ type: SWIPER_RIGHT_CHANGED, payload });
  },
  subscribeSwipeRight: (payload) => {
    dispatch({ type: SWIPER_RIGHT_SUBSCRIBED, payload });
  },
  unsubscribeSwipeRight: (payload) => {
    dispatch({ type: SWIPER_RIGHT_UNSUBSCRIBED, payload });
  },
  changeSwipeTop: (payload) => {
    dispatch({ type: SWIPER_TOP_CHANGED, payload });
  },
  subscribeSwipeTop: (payload) => {
    dispatch({ type: SWIPER_TOP_SUBSCRIBED, payload });
  },
  unsubscribeSwipeTop: (payload) => {
    dispatch({ type: SWIPER_TOP_UNSUBSCRIBED, payload });
  },
  changeSwipePlace: (payload) => {
    dispatch({ type: SWIPER_PLACE_CHANGED, payload });
  },
  changeSwipePhotos: (payload) => {
    dispatch({ type: SWIPER_PHOTOS_CHANGED, payload });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ItSettingsScreen);
