import React, { Component } from 'react';
import { View, Alert } from 'react-native';
import {
  Button,
  List,
  Dialog,
  Portal,
  FAB,
  Checkbox,
  Text,
} from 'react-native-paper';
import { connect } from 'react-redux';
import inatjs from 'inaturalistjs';
import * as WebBrowser from 'expo-web-browser';

import ItObservationSwiper from '../components/features/ItObservationSwiper';
import {
  ItScreenContainer,
  ItSpinner,
  ItHeaderButtons,
  HeaderItem,
} from '../components/common';

import {
  OBSERVATION_SKIPPED,
} from '../actions/types';

class IiIdentifyScreen extends Component {
  INITIAL_STATE = {
    user: {},
    apiToken: this.props.auth.apiToken,
    swipeDirection: '',
    cardIndex: 0,
    observations: [],
    page: 0,
    visible: false,
    currentObservationCaptive: false,
  };

  constructor(props) {
    super(props);
    this.state = this.INITIAL_STATE;
  }

  componentDidMount = async () => {
    const { navigation, swiper } = this.props;
    const { place } = swiper;
    navigation.setOptions({
      title: place.label,
      headerRight: () => (
        <ItHeaderButtons>
          <HeaderItem
            testID="header_info_button"
            title="info"
            iconName="info"
            onPress={() => this.showDialog()}
          />
        </ItHeaderButtons>
      ),
    });
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

  onAnySwiped = () => {
    this.setState({ currentObservationCaptive: false });
  }

  onSwipedLeft(index) {
    const { observations } = this.state;
    const { swiper } = this.props;
    const { swipeLeft } = swiper;
    this.setState({ cardIndex: index + 1 });
    // Use set id for this identification
    this.identifyInAnimationFrame(observations[index], swipeLeft);
    this.onAnySwiped();
  }

  onSwipedRight(index) {
    const { observations } = this.state;
    const { swiper } = this.props;
    const { swipeRight } = swiper;
    this.setState({ cardIndex: index + 1 });
    // Use set id for this identification
    this.identifyInAnimationFrame(observations[index], swipeRight);
    this.onAnySwiped();
  }

  onSwipedTop(index) {
    const { observations } = this.state;
    const { swiper } = this.props;
    const { swipeTop } = swiper;
    this.setState({ cardIndex: index + 1 });
    // Use set id for this identification
    this.identifyInAnimationFrame(observations[index], swipeTop);
    this.onAnySwiped();
  }

  onSwipedBottom(index) {
    const { observations } = this.state;
    const { observationSkipped } = this.props;
    this.setState({ cardIndex: index + 1 });
    // Add the skipped observation's id to the observation reducer
    observationSkipped(observations[index].id);
    this.onAnySwiped();
  }

  onSwipedAllCards = () => {
    this.setState({ observations: [] });
    // Get new batch of unidentified observation
    this.searchObservations();
  };

  getCurrentUser = async () => {
    const { auth } = this.props;
    const { apiToken } = auth;
    const options = { api_token: apiToken };
    return await inatjs.users
      .me(options)
      .then((r) => {
        this.setState({ user: r.results[0] });
        return r;
      })
      // TODO: UI response
      .catch(e => {
        console.log('Error in fetching current user', e);
        console.log(e.response);
        // Show alert for failure of getting user object from iNat
        Alert.alert(
          'Sorry',
          'Unfortunately, something went wrong. You can not proceed.',
        );
      });
  };

  commentOnObservation = (commentText) => {
    const { observations, cardIndex } = this.state;
    const { apiToken } = this.props.auth; 
    this.setState({ commentLoading: true });
    const params = {
      comment: {
        body: commentText,
        parent_type: 'Observation',
        parent_id: observations[cardIndex].id,
      },
    };
    const options = { api_token: apiToken };
    inatjs.comments
      .create(params, options)
      .then((c) => {
        console.log('New comment', c);
        Alert.alert(
          'Success',
          'The comment was added. However, it will not show here only in the website.',
        );
        this.setState({ commentLoading: false });
        this.hideCommentDialog();
      })
      .catch((e) => {
        console.log('Error in adding comment', e);
        console.log(e.response);
        Alert.alert(
          'Sorry',
          'Unfortunately, something went wrong. The comment could not be added.',
        );
        this.setState({ commentLoading: false });
        this.hideCommentDialog();
      });
  };

  cultivate = () => {
    const {
      observations,
      cardIndex,
      currentObservationCaptive,
    } = this.state;
    const { apiToken } = this.props.auth;
    const options = { api_token: apiToken };
    inatjs.observations
      .setQualityMetric(
        {
          ...observations[cardIndex],
          metric: 'wild',
          agree: currentObservationCaptive.toString(),
        },
        options,
      )
      .then((rsp) => {
        this.setState({ currentObservationCaptive: !currentObservationCaptive });
        console.log('Marked as captive: ', rsp);
      })
      .catch((e) => {
        console.log('Error in marked as captive', e);
        console.log(e.response);
        Alert.alert(
          'Sorry',
          'Unfortunately, something went wrong. The observation was not marked as captive.',
        );
      });
  };

  searchObservations() {
    const { user, page } = this.state;
    const { swiper } = this.props;
    const { place, maxPhotos, sortOrder, isCaptive } = swiper;
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
      order: sortOrder,
      order_by: 'created_at',
      without_taxon_id: [67333, 131236, 151817],
      captive: isCaptive,
    };

    inatjs.observations
      .search(params)
      .then(rsp => {
        const filteredResults = rsp.results
          .filter(d => !d.species_guess)
          .filter(d => d.photos.length <= maxPhotos);
        this.setState(
          {
            observations: filteredResults,
            page: rsp.page,
            cardIndex: 0,
          },
          () => {
            if (filteredResults.length === 0) {
              this.searchObservations();
            }
          },
        );
      })
      .catch(e => {
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
    const { apiToken } = this.props.auth;
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

  showDialog = () => {
    this.setState({ visible: true });
  };

  hideDialog = () => {
    this.setState({ visible: false });
  };

  showCommentDialog = () => {
    this.setState({ commentVisible: true });
  };

  hideCommentDialog = () => {
    this.setState({ commentVisible: false });
  };

  showWeb = () => {
    const { observations, cardIndex } = this.state;
    const observation = observations[cardIndex];
    const baseURL = 'https://www.inaturalist.org/observations/';
    const url = `${baseURL}${observation.id}`;
    WebBrowser.openBrowserAsync(url);
    this.swiper.swipeBottom();
  };

  skipAndReview = () => {
    const { apiToken } = this.props.auth;
    const { observations, cardIndex } = this.state;
    const options = { api_token: apiToken };
    inatjs.observations
      .review(observations[cardIndex], options)
      .then(rsp => console.log('Reviewed: ', rsp))
      .catch((e) => {
        console.log('Error in reviewing observation', e);
        console.log(e.response);
        Alert.alert(
          'Sorry',
          'Unfortunately, something went wrong. The observation was skipped but not marked as reviewed.',
        );
      });
    this.swiper.swipeBottom();
  };

  renderFAB() {
    const { fabOpen, currentObservationCaptive } = this.state;
    return (
      <FAB.Group
        color="#FFFFFF"
        open={fabOpen}
        icon={fabOpen ? 'close' : 'toolbox'}
        actions={[
          {
            icon: 'link',
            label: 'Show on website',
            onPress: () => this.showWeb(),
          },
          {
            icon: 'comment',
            label: 'Add comment',
            onPress: () => this.showCommentDialog(),
          },
          {
            icon: currentObservationCaptive
              ? 'check-box-outline'
              : 'checkbox-blank-outline',
            label: 'Mark as captive/cultivated',
            onPress: () => this.cultivate(),
          },
          {
            icon: 'arrow-down-bold',
            label: 'Skip and review',
            onPress: () => this.skipAndReview(),
          },
        ]}
        onStateChange={({ open }) => this.setState({ fabOpen: open })}
      />
    );
  }

  renderInfoModal() {
    const { visible } = this.state;
    const { swiper } = this.props;
    const { swipeTop, swipeLeft, swipeRight } = swiper;
    return (
      <Portal>
        <Dialog visible={visible} onDismiss={this.hideDialog}>
          <Dialog.Title>Your current settings</Dialog.Title>
          <Dialog.Content>
            <List.Item
              title={swipeTop.label}
              left={() => <List.Icon icon="arrow-up-bold" />}
            />
            <List.Item
              title={swipeLeft.label}
              left={() => <List.Icon icon="arrow-left-bold" />}
            />
            <List.Item
              title={swipeRight.label}
              left={() => <List.Icon icon="arrow-right-bold" />}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={this.hideDialog}>Thanks</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    );
  }

  renderCommentDialog() {
    const { commentVisible, checkedIndex, commentLoading } = this.state;
    const { predefinedComments } = this.props;
    return (
      <Portal>
        <Dialog visible={commentVisible} onDismiss={this.hideCommentDialog}>
          <Dialog.Title>Predefined comments</Dialog.Title>
          <Dialog.Content>
            {predefinedComments.map((predefinedComment, commentIndex) => {
              if (!predefinedComment) {
                return null;
              }
              return (
                <View
                  key={commentIndex}
                  style={{ flexDirection: 'row', padding: 4 }}>
                  <Checkbox
                    uncheckedColor="#888888"
                    status={
                      checkedIndex === commentIndex ? 'checked' : 'unchecked'
                    }
                    onPress={() => {
                      this.setState({
                        checkedIndex: commentIndex,
                      });
                    }}
                  />
                  <Text
                    onPress={() => {
                      this.setState({
                        checkedIndex: commentIndex,
                      });
                    }}>
                    {predefinedComment}
                  </Text>
                </View>
              );
            })}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={this.hideCommentDialog}>Cancel</Button>
            <Button
              onPress={() => this.commentOnObservation(predefinedComments[checkedIndex])}
              disabled={!checkedIndex || commentLoading}
              loading={commentLoading}
            >
              Add Comment
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    );
  }

  render() {
    const { observations, cardIndex } = this.state;
    const { swiper } = this.props;
    if (!observations || !observations.length > 0) {
      return <ItSpinner size="large" />;
    }
    return (
      <ItScreenContainer>
        <ItObservationSwiper
          swiperRef={swiperRef => {
            this.swiper = swiperRef;
          }}
          observations={observations}
          cardIndex={cardIndex}
          swiper={swiper}
          onSwipedLeft={index => this.onSwipedLeft(index)}
          onSwipedRight={index => this.onSwipedRight(index)}
          onSwipedTop={index => this.onSwipedTop(index)}
          onSwipedBottom={index => this.onSwipedBottom(index)}
          onSwipedAll={this.onSwipedAllCards}
        />
        {this.renderInfoModal()}
        {this.renderCommentDialog()}
        {this.renderFAB()}
      </ItScreenContainer>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  swiper: state.swiper,
  predefinedComments: state.comment.predefinedComments,
});

const mapDispatchToProps = dispatch => ({
  observationSkipped: (payload) => {
    dispatch({ type: OBSERVATION_SKIPPED, payload });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(IiIdentifyScreen);
