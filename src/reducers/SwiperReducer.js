import {
  SWIPER_LEFT_CHANGED,
  SWIPER_RIGHT_CHANGED,
  SWIPER_TOP_CHANGED,
  SWIPER_PLACE_CHANGED,
  SWIPER_LEFT_SUBSCRIBED,
  SWIPER_LEFT_UNSUBSCRIBED,
  SWIPER_RIGHT_SUBSCRIBED,
  SWIPER_RIGHT_UNSUBSCRIBED,
  SWIPER_TOP_SUBSCRIBED,
  SWIPER_TOP_UNSUBSCRIBED,
  SWIPER_PHOTOS_CHANGED,
  SWIPER_SORT_CHANGED,
  SWIPER_CAPTIVE_CHANGED,
} from '../actions/types';

const INITIAL_STATE = {
  swipeLeft: {
    id: 1,
    label: 'Animalia',
    subscribe: true,
  },
  swipeRight: {
    id: 47126,
    label: 'Plantae',
    subscribe: true,
  },
  swipeTop: {
    id: 47170,
    label: 'Fungi',
    subscribe: true,
  },
  place: {
    id: 97391,
    label: 'Europe',
    subscribe: true,
  },
  maxPhotos: 1,
  sortOrder: 'asc',
  isCaptive: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SWIPER_LEFT_CHANGED:
      return { ...state, swipeLeft: action.payload };
    case SWIPER_LEFT_SUBSCRIBED:
      return {
        ...state,
        swipeLeft: {
          ...state.swipeLeft,
          subscribe: true,
        },
      };
    case SWIPER_LEFT_UNSUBSCRIBED:
      return { ...state, swipeLeft: { ...state.swipeLeft, subscribe: false } };
    case SWIPER_RIGHT_CHANGED:
      return {
        ...state,
        swipeRight: action.payload,
      };
    case SWIPER_RIGHT_SUBSCRIBED:
      return {
        ...state,
        swipeRight: {
          ...state.swipeRight,
          subscribe: true,
        },
      };
    case SWIPER_RIGHT_UNSUBSCRIBED:
      return { ...state, swipeRight: { ...state.swipeRight, subscribe: false } };
    case SWIPER_TOP_CHANGED:
      return {
        ...state,
        swipeTop: action.payload,
      };
    case SWIPER_TOP_SUBSCRIBED:
      return {
        ...state,
        swipeTop: {
          ...state.swipeTop,
          subscribe: true,
        },
      };
    case SWIPER_TOP_UNSUBSCRIBED:
      return { ...state, swipeTop: { ...state.swipeTop, subscribe: false } };
    case SWIPER_PLACE_CHANGED:
      return {
        ...state,
        place: action.payload,
      };
    case SWIPER_PHOTOS_CHANGED:
      return {
        ...state,
        maxPhotos: action.payload.value,
      };
    case SWIPER_SORT_CHANGED:
      return {
        ...state,
        sortOrder: action.payload.value,
      };
    case SWIPER_CAPTIVE_CHANGED:
      return {
        ...state,
        isCaptive: action.payload.value,
      };
    default:
      return state;
  }
};
