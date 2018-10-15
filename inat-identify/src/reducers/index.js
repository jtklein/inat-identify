import { combineReducers } from 'redux';

import SwiperReducer from './SwiperReducer';

export default combineReducers({
  // Handmade reducers
  swiper: SwiperReducer,
});
