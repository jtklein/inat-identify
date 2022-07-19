import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { Switch, List, Button, Searchbar } from 'react-native-paper';
import inatjs from 'inaturalistjs';
import { DatePickerModal } from 'react-native-paper-dates';

import { ItScreenContainer, ItText } from '../components/common';
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
  SWIPER_START_DATE_CHANGED,
  SWIPER_END_DATE_CHANGED,
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
    label: 'One',
  },
  {
    value: Infinity,
    label: 'One or more',
  },
];

const sortOptions = [
  {
    value: 'asc',
    label: 'Oldest first',
  },
  {
    value: 'desc',
    label: 'Newest first',
  },
];

const captiveOptions = [
  {
    value: true,
    label: 'Only captive/cultivated',
  },
  {
    value: false,
    label: "Don't show captive/cultivated",
  },
];

const ItEntryScreen = (props) => {
  const [showFilter, setShowFilter] = useState(true);
  const [placeSearchText, setPlaceSearchText] = useState(undefined);
  const [dateOpen, setDateOpen] = useState(false);
  const [dateMode, setDateMode] = useState('start');
  const [places, setPlaces] = useState();

  const { navigation } = props;
  const { container, screenContainer } = styles;

  onFilterPressed = () => {
    setShowFilter(true);
  };

  onActionsPressed = () => {
    setShowFilter(false);
  };

  onChangePlaceSearch = (text) => {
    setPlaceSearchText(text);
    inatjs.places
      .autocomplete({ q: text, order_by: 'area' })
      .then((rsp) => setPlaces(rsp.results));
  };

  openDate = (newDateMode) => {
    setDateOpen(true);
    setDateMode(newDateMode);
  };

  clearDate = () => {
    const { changeSwipeStartDate, changeSwipeEndDate } = props;
    changeSwipeStartDate(null);
    changeSwipeEndDate(null);
  };

  onConfirmDate = (date) => {
    const { changeSwipeStartDate, changeSwipeEndDate } = props;
    if (dateMode === 'start') {
      changeSwipeStartDate(date.toISOString());
    }
    if (dateMode === 'end') {
      changeSwipeEndDate(date.toISOString());
    }
    setDateOpen(false);
  };

  renderFilterSettings = () => {
    const {
      changeSwipePlace,
      changeSwipePhotos,
      changeSwipeSort,
      changeSwipeIsCaptive,
      swiper,
    } = props;
    const { place, maxPhotos, sortOrder, isCaptive, startDate, endDate } =
      swiper;
    const { container } = styles;
    return (
      <View style={container}>
        <List.AccordionGroup>
          <List.Accordion
            id="places"
            title={`Only from ${place.label}`}
            description="Show observations from a certain place only."
            descriptionNumberOfLines={10}
            left={(props) => <List.Icon {...props} icon="map-marker" />}>
            <Searchbar
              placeholder="Search"
              onChangeText={onChangePlaceSearch}
              value={placeSearchText}
            />
            {places
              ? places.map((p) => (
                  <List.Item
                    key={p.id}
                    title={p.display_name}
                    onPress={() =>
                      changeSwipePlace({ ...p, label: p.display_name })
                    }
                  />
                ))
              : defaultPlaces.map((p) => (
                  <List.Item
                    key={p.id}
                    title={p.label}
                    onPress={() => changeSwipePlace(p)}
                  />
                ))}
          </List.Accordion>
          <List.Accordion
            id="photos"
            title={`Observations with ${
              maxPhotos === 1 ? 'one photo' : 'one or more photos'
            }`}
            description="Show observations with only one photo, or don't filter by number of photos."
            descriptionNumberOfLines={10}
            left={(props) => <List.Icon {...props} icon="image" />}>
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
            title={`Show ${
              sortOrder === 'asc' ? 'oldest' : 'newest'
            } observations first`}
            description="Sort observations by date of creation."
            descriptionNumberOfLines={10}
            left={(props) => <List.Icon {...props} icon="sort" />}>
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
            title={`Show ${isCaptive ? 'only' : 'no'} captive/cultivated`}
            description="Show only observations that are marked as cultivated, or exclude those"
            descriptionNumberOfLines={10}
            left={(props) => <List.Icon {...props} icon="flower" />}>
            {captiveOptions.map((p) => (
              <List.Item
                key={p.label}
                title={p.label}
                onPress={() => changeSwipeIsCaptive(p)}
              />
            ))}
          </List.Accordion>
          <List.Accordion
            id="date"
            title={`${
              !startDate
                ? 'Show all observations'
                : 'From ' + new Date(startDate).toDateString()
            }${!endDate ? '' : ' to ' + new Date(endDate).toDateString()}`}
            description="Show only observations that are from a specified date range"
            descriptionNumberOfLines={10}
            left={(props) => <List.Icon {...props} icon="calendar" />}>
            <List.Item
              key="start"
              title="Set start date"
              onPress={() => openDate('start')}
            />
            <List.Item
              key="end"
              title="Set end date"
              onPress={() => openDate('end')}
            />
            <List.Item
              key="clear"
              title="Clear date range"
              onPress={() => clearDate()}
            />
          </List.Accordion>
        </List.AccordionGroup>
      </View>
    );
  };

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
    } = props;
    const { swipeLeft, swipeRight, swipeTop } = swiper;

    const { container, subscriptionContainer } = styles;
    return (
      <View style={container}>
        <List.AccordionGroup>
          <List.Accordion
            id="left"
            title={`Swipe left = ${swipeLeft.label}`}
            description="The observation will be identified as this taxon when swiped to the left."
            descriptionNumberOfLines={10}
            left={(props) => <List.Icon {...props} icon="arrow-left-bold" />}>
            {taxa.map((taxon) => (
              <List.Item
                key={taxon.id}
                title={taxon.label}
                onPress={() => changeSwipeLeft(taxon)}
              />
            ))}
          </List.Accordion>
          <View style={subscriptionContainer}>
            <ItText>{`Subscribe to ${swipeLeft.label} identifications`}</ItText>
            <Switch
              testID="subscribe_left"
              value={swipeLeft.subscribe}
              onValueChange={() =>
                swipeLeft.subscribe
                  ? unsubscribeSwipeLeft()
                  : subscribeSwipeLeft()
              }
            />
          </View>

          <List.Accordion
            id="right"
            title={`Swipe right = ${swipeRight.label}`}
            description="The observation will be identified as this taxon when swiped to the right."
            descriptionNumberOfLines={10}
            left={(props) => <List.Icon {...props} icon="arrow-right-bold" />}>
            {taxa.map((taxon) => (
              <List.Item
                key={taxon.id}
                title={taxon.label}
                onPress={() => changeSwipeRight(taxon)}
              />
            ))}
          </List.Accordion>
          <View style={subscriptionContainer}>
            <ItText>{`Subscribe to ${swipeRight.label} identifications`}</ItText>
            <Switch
              testID="subscribe_right"
              value={swipeRight.subscribe}
              onValueChange={() =>
                swipeRight.subscribe
                  ? unsubscribeSwipeRight()
                  : subscribeSwipeRight()
              }
            />
          </View>

          <List.Accordion
            id="top"
            title={`Swipe top = ${swipeTop.label}`}
            description="The observation will be identified as this taxon when swiped to the top."
            descriptionNumberOfLines={10}
            left={(props) => <List.Icon {...props} icon="arrow-up-bold" />}>
            {taxa.map((taxon) => (
              <List.Item
                key={taxon.id}
                title={taxon.label}
                onPress={() => changeSwipeTop(taxon)}
              />
            ))}
          </List.Accordion>
          <View style={subscriptionContainer}>
            <ItText>{`Subscribe to ${swipeTop.label} identifications`}</ItText>
            <Switch
              testID="subscribe_top"
              value={swipeTop.subscribe}
              onValueChange={() =>
                swipeTop.subscribe ? unsubscribeSwipeTop() : subscribeSwipeTop()
              }
            />
          </View>
        </List.AccordionGroup>
      </View>
    );
  };

  renderSettings = () => {
    return showFilter ? renderFilterSettings() : renderActionsSettings();
  };

  return (
    <ItScreenContainer>
      <ScrollView style={screenContainer}>
        <View
          testID="settings_screen"
          style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
          <Button
            testID="filter_tab"
            dark
            icon="filter-variant"
            mode={showFilter ? 'contained' : 'outlined'}
            onPress={() => onFilterPressed()}>
            Filter
          </Button>
          <Button
            testID="actions_tab"
            dark
            icon="arrow-expand-all"
            mode={!showFilter ? 'contained' : 'outlined'}
            onPress={() => onActionsPressed()}>
            Actions
          </Button>
        </View>
        <View style={container}>{renderSettings()}</View>
        <Button
          testID="start_swiper"
          onPress={() => navigation.navigate('Identify')}>
          Start swiping
        </Button>
      </ScrollView>
      <DatePickerModal
        locale="en"
        mode="single"
        visible={dateOpen}
        onDismiss={() => setDateOpen(false)}
        onConfirm={(p) => onConfirmDate(p.date)}
      />
    </ItScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  screenContainer: {
    flex: 1,
  },
  subscriptionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 16,
  },
});

const mapStateToProps = (state) => ({
  swiper: state.swiper,
});

const mapDispatchToProps = (dispatch) => ({
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
  changeSwipeStartDate: (payload) => {
    dispatch({ type: SWIPER_START_DATE_CHANGED, payload });
  },
  changeSwipeEndDate: (payload) => {
    dispatch({ type: SWIPER_END_DATE_CHANGED, payload });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ItEntryScreen);
