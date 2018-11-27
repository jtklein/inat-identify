import React, { Component } from 'react';
import { Alert } from 'react-native';
import { connect } from 'react-redux';
import inatjs from 'inaturalistjs';

import ItSwiper from '../components/features/ItSwiper';
import {
  ItScreenContainer,
  ItSpinner,
} from '../components/common';

class IiIdentifyScreen extends Component {
  static navigationOptions = ({ navigation }) => ({ title: navigation.getParam('title') });

  INITIAL_STATE = {
    user: {},
    apiToken: this.props.navigation.state.params.apiToken,
    swipeDirection: '',
    cardIndex: 0,
    observations: [],
    page: 0,
  };

  constructor(props) {
    super(props);
    this.state = this.INITIAL_STATE;
  }

  componentDidMount = async () => {
    const { navigation, swiper } = this.props;
    const { place } = swiper;
    navigation.setParams({ title: place.label });
    // TODO: refactor to app start up, if we ever have different screens
    const user = await this.getCurrentUser();
    console.log('user', user);
    if (user) {
      // Get first batch of unidentified observations
      this.searchObservations();
    }
  };

  shouldComponentUpdate(nextProps, nextState) {
    const { swiper } = this.props;
    if (swiper !== nextProps.swiper) {
      return false;
    }
    return true;
  }

  onSwipedLeft(index) {
    const { observations } = this.state;
    const { swiper } = this.props;
    const { swipeLeft } = swiper;
    this.setState({ cardIndex: index + 1 });
    // Use set id for this identification
    this.identifyInAnimationFrame(observations[index], swipeLeft);
  }

  onSwipedRight(index) {
    const { observations } = this.state;
    const { swiper } = this.props;
    const { swipeRight } = swiper;
    this.setState({ cardIndex: index + 1 });
    // Use set id for this identification
    this.identifyInAnimationFrame(observations[index], swipeRight);
  }

  onSwipedTop(index) {
    const { observations } = this.state;
    const { swiper } = this.props;
    const { swipeTop } = swiper;
    this.setState({ cardIndex: index + 1 });
    // Use set id for this identification
    this.identifyInAnimationFrame(observations[index], swipeTop);
  }

  onSwipedBottom(index) {
    this.setState({ cardIndex: index + 1 });
    // Nothing to do here, as this is the skip option
  }

  onSwipedAllCards = () => {
    this.setState({ observations: [] });
    // Get new batch of unidentified observation
    this.searchObservations();
  };

  getCurrentUser = async () => {
    const { apiToken } = this.state;
    const options = { api_token: apiToken };
    return await inatjs.users
      .me(options)
      .then((r) => {
        this.setState({ user: r.results[0] });
        return r;
      })
      // TODO: UI response
      .catch((e) => {
        console.log('Error in fetching current user', e);
        console.log(e.response);
        // Show alert for failure of getting user object from iNat
        Alert.alert(
          'Sorry',
          'Unfortunately, something went wrong. You can not proceed.',
        );
      });
  };

  searchObservations() {
    const { user, page } = this.state;
    const { swiper } = this.props;
    const { place, maxPhotos } = swiper;
    const params = {
      iconic_taxa: 'unknown',
      quality_grade: 'needs_id',
      per_page: 100,
      page: page + 1,
      // Must be observed within the place with this ID
      place_id: place.id,
      // Observations have been reviewed by the user with ID equal to the value of the viewer_id parameter
      viewer_id: user.id,
      reviewed: 'false',
      photos: 'true',
    };

    inatjs.observations
      .search(params)
      .then((rsp) => {
        const filteredResults = rsp.results.filter(d => !d.species_guess).filter(d => d.photos.length <= maxPhotos);
        this.setState({
          observations: filteredResults,
          page: rsp.page,
          cardIndex: 0,
        });
      })
      .catch((e) => {
        console.log('Error in fetching list of observations', e);
        console.log(e.response);
        Alert.alert(
          'Sorry',
          'Unfortunately, something went wrong. You can not proceed.',
        );
      });
  }

  identifyInAnimationFrame(observation, swipeOption) {
    requestAnimationFrame(() => {
      this.identify(observation, swipeOption);
    });
  }

  identify(observation, swipeOption) {
    console.log('observation', observation);
    const { apiToken } = this.state;
    /*
    {
      "identification": {
        "observation_id": 0,
        "taxon_id": 0,
        "current": true,
        "body": "string"
      }
    }
    */
    const identification = {
      identification: {
        observation_id: observation.id,
        taxon_id: swipeOption.id,
      },
    };
    const options = { api_token: apiToken };
    inatjs.identifications
      .create(identification, options)
      .then((c) => {
        console.log('identification', c);
        if (!swipeOption.subscribe) {
          inatjs.observations
            .subscribe(observation, options)
            .then(rsp => console.log('Unsubscriped to: ', rsp))
            .catch((e) => {
              console.log('Error in unsubscribing to observation', e);
              console.log(e.response);
            });
        }
      })
      .catch((e) => {
        console.log('Error in creating identification', e);
        console.log(e.response);
        Alert.alert(
          'Sorry',
          'Unfortunately, something went wrong. Your identification was not processed.',
        );
      });
  }

  render() {
    const { observations, cardIndex } = this.state;
    const { swiper } = this.props;
    if (!observations || !observations.length > 0) {
      return <ItSpinner />;
    }
    return (
      <ItScreenContainer>
        <ItSwiper
          observations={observations}
          cardIndex={cardIndex}
          swiper={swiper}
          onSwipedLeft={index => this.onSwipedLeft(index)}
          onSwipedRight={index => this.onSwipedRight(index)}
          onSwipedTop={index => this.onSwipedTop(index)}
          onSwipedBottom={index => this.onSwipedBottom(index)}
          onSwipedAll={this.onSwipedAllCards}
        />
      </ItScreenContainer>
    );
  }
}

const mapStateToProps = state => ({
  swiper: state.swiper,
});

export default connect(mapStateToProps, undefined)(IiIdentifyScreen);
