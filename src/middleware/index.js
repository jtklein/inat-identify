import ReduxThunk from 'redux-thunk';
import promise from 'redux-promise-middleware';
import logger from 'redux-logger';

const middlewares = [
  ReduxThunk, // Thunk middleware for Redux
  promise, // ReduxPromise middleware
];

// In development mode add these middlewares
if (__DEV__) {
  // A basic middleware logger
  middlewares.push(logger);
}

export default middlewares;
