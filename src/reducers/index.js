import { combineReducers } from 'redux';

import SwiperReducer from './SwiperReducer';
import CommentReducer from './CommentReducer';
import ObservationsReducer from './ObservationsReducer';

export default combineReducers({
  // Handmade reducers
  swiper: SwiperReducer,
  comment: CommentReducer,
  observations: ObservationsReducer,
});
