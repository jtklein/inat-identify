import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Switch, List, Button } from 'react-native-paper';

import inatjs from 'inaturalistjs';

const places = [
  {
    id: 97389,
    label: 'South America'
  },
  {
    id: 97391,
    label: 'Europe'
  },
  {
    id: 97392,
    label: 'Africa'
  },
  {
    id: 97393,
    label: 'Oceania'
  },
  {
    id: 97394,
    label: 'North America'
  },
  {
    id: 97395,
    label: 'Asia'
  }
];

const taxa = [
  {
    id: 1,
    label: 'Animalia',
    subscribe: true
  },
  {
    id: 47126,
    label: 'Plantae',
    subscribe: true
  },
  {
    id: 47170,
    label: 'Fungi',
    subscribe: true
  },
  {
    id: 51890,
    label: 'Crassulaceae',
    subscribe: true
  }
];

export default class ItSettingsScreen extends Component {
  INITIAL_STATE = {
    apiToken: this.props.navigation.state.params.apiToken,
    swipeLeft: {
      id: 1,
      label: 'Animalia',
      subscribe: true
    },
    swipeRight: {
      id: 47126,
      label: 'Plantae',
      subscribe: true
    },
    swipeTop: {
      id: 47170,
      label: 'Fungi',
      subscribe: true
    },
    place: {
      id: 97391,
      label: 'Europe',
      subscribe: true
    }
  };

  constructor(props) {
    super(props);
    this.state = this.INITIAL_STATE;
  }

  render() {
    const { navigation } = this.props;
    const { apiToken, swipeLeft, swipeRight, swipeTop, place } = this.state;
    return <View style={styles.container}>
        <Text>Customize the swiper here:</Text>
        <Text>{apiToken}</Text>

        <List.Accordion title={`Filter by place = ${place.label}`}>
          {places.map(place => (
            <List.Item
              key={place.id}
              title={place.label}
              onPress={() => this.setState({ place })}
            />
          ))}
        </List.Accordion>

        <List.Accordion title={`Swipe left = ${swipeLeft.label}`}>
          {taxa.map(taxon => (
            <List.Item
              key={taxon.id}
              title={taxon.label}
              onPress={() => this.setState({ swipeLeft: taxon })}
            />
          ))}
        </List.Accordion>
        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
          <Text>Subscribe to this identification</Text>
          <Switch value={swipeLeft.subscribe} onValueChange={() => this.setState(
                {
                  swipeLeft: Object.assign(swipeLeft, {
                    subscribe: !swipeLeft.subscribe
                  })
                }
              )} />
        </View>

        <List.Accordion title={`Swipe right = ${swipeRight.label}`}>
          {taxa.map(taxon => (
            <List.Item
              key={taxon.id}
              title={taxon.label}
              onPress={() => this.setState({ swipeRight: taxon })}
            />
          ))}
        </List.Accordion>
        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
          <Text>Subscribe to this identification</Text>
          <Switch value={swipeRight.subscribe} onValueChange={() => this.setState(
            {
              swipeRight: Object.assign(swipeRight, {
                subscribe: !swipeRight.subscribe
              })
            }
          )} />
        </View>

        <List.Accordion title={`Swipe top = ${swipeTop.label}`}>
          {taxa.map(taxon => (
            <List.Item
              key={taxon.id}
              title={taxon.label}
              onPress={() => this.setState({ swipeTop: taxon })}
            />
          ))}
        </List.Accordion>
        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
          <Text>Subscribe to this identification</Text>
          <Switch value={swipeTop.subscribe} onValueChange={() => this.setState(
            {
              swipeTop: Object.assign(swipeTop, {
                subscribe: !swipeTop.subscribe
              })
            }
          )} />
        </View>

        <Button onPress={() => navigation.navigate('Identify', {
              apiToken,
              swipeLeft,
              swipeRight,
              swipeTop,
              place
            })}>
          Done
        </Button>
      </View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
});
