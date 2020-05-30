import { combineReducers } from 'redux';

import AuthReducer from './AuthReducer';
import SwiperReducer from './SwiperReducer';
import CommentReducer from './CommentReducer';
import ObservationsReducer from './ObservationsReducer';

export default combineReducers({
  // Handmade reducers
  auth: AuthReducer,
  swiper: SwiperReducer,
  comment: CommentReducer,
  observations: ObservationsReducer,
});
