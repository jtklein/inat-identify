import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { connect } from 'react-redux';
import { Switch, List, Button, Searchbar } from 'react-native-paper';
import inatjs from 'inaturalistjs';

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
  SWIPER_SORT_CHANGED,
  SWIPER_CAPTIVE_CHANGED,
} from '../actions/types';

const defaultPlaces = [
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

const sortOptions = [
  {
    value: 'asc',
    label: 'ascending',
  },
  {
    value: 'desc',
    label: 'descending',
  },
];

const captiveOptions = [
  {
    value: true,
    label: 'true',
  },
  {
    value: false,
    label: 'false',
  },
];

class ItSettingsScreen extends Component {
  INITIAL_STATE = {
    showFilter: true,
    placeSearchText: undefined,
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

  onChangePlaceSearch = (text) => {
    this.setState({ placeSearchText: text });
    inatjs.places
      .autocomplete({ q: text, order_by: 'area' })
      .then((rsp) => this.setState({ places: rsp.results }));
  }

  renderFilterSettings = () => {
    const { placeSearchText, places } = this.state;
    const {
      changeSwipePlace,
      changeSwipePhotos,
      changeSwipeSort,
      changeSwipeIsCaptive,
      swiper,
    } = this.props;
    const { place, maxPhotos, sortOrder, isCaptive } = swiper;
    const { container } = styles;
    return (
      <View style={container}>
        <List.AccordionGroup>
          <List.Accordion
            id="places"
            title={`by place = ${place.label}`}
            left={(props) => <List.Icon {...props} icon="map-marker" />}
          >
            <Searchbar
              placeholder="Search"
              onChangeText={this.onChangePlaceSearch}
              value={placeSearchText}
            />
            {places ? places.map((p) => (
              <List.Item
                key={p.id}
                title={p.display_name}
                onPress={() => changeSwipePlace({ ...p, label: p.display_name })}
              />
            )) : defaultPlaces.map((p) => (
              <List.Item
                key={p.id}
                title={p.label}
                onPress={() => changeSwipePlace(p)}
              />
            ))}
          </List.Accordion>
          <List.Accordion
            id="photos"
            title={`by number photos = ${maxPhotos}`}
            left={(props) => <List.Icon {...props} icon="image" />}
          >
            {photosOptions.map((p) => (
              <List.Item
                key={p.label}
                title={p.label}
                onPress={() => changeSwipePhotos(p)}
              />
            ))}
          </List.Accordion>
          <List.Accordion
            id="sort"
            title={`sorted by creation date = ${sortOrder}`}
            left={(props) => <List.Icon {...props} icon="sort" />}
          >
            {sortOptions.map((p) => (
              <List.Item
                key={p.label}
                title={p.label}
                onPress={() => changeSwipeSort(p)}
              />
            ))}
          </List.Accordion>
          <List.Accordion
            id="captive"
            title={`is captive/cultivated = ${isCaptive}`}
            left={(props) => <List.Icon {...props} icon="flower" />}
          >
            {captiveOptions.map((p) => (
              <List.Item
                key={p.label}
                title={p.label}
                onPress={() => changeSwipeIsCaptive(p)}
              />
            ))}
          </List.Accordion>
        </List.AccordionGroup>
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
          left={props => <List.Icon {...props} icon="arrow-left-bold" />}
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
          left={props => <List.Icon {...props} icon="arrow-right-bold" />}
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
          left={props => <List.Icon {...props} icon="arrow-up-bold" />}
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
        <List.Item
          title="Privacy policy"
          onPress={() =>
            WebBrowser.openBrowserAsync(
              'https://www.inaturalist.org/journal/jtklein/24285-privacy-policy-for-inat-toolcat',
            )
          }
        />
        <View
          testID="settings_screen"
          style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
          <Button
            testID="filter_tab"
            dark
            icon="filter-variant"
            mode={showFilter ? 'contained' : 'outlined'}
            onPress={() => this.onFilterPressed()}>
            Filter
          </Button>
          <Button
            testID="actions_tab"
            dark
            icon="arrow-expand-all"
            mode={!showFilter ? 'contained' : 'outlined'}
            onPress={() => this.onActionsPressed()}>
            Actions
          </Button>
        </View>
        <View style={container}>{this.renderSettings()}</View>
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
  changeSwipeSort: (payload) => {
    dispatch({ type: SWIPER_SORT_CHANGED, payload });
  },
  changeSwipeIsCaptive: (payload) => {
    dispatch({ type: SWIPER_CAPTIVE_CHANGED, payload });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ItSettingsScreen);
