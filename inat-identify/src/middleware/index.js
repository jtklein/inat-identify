import ReduxThunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import logger from 'redux-logger';

const middlewares = [
  ReduxThunk, // Thunk middleware for Redux
  promiseMiddleware(), // ReduxPromise middleware
];

// In development mode add these middlewares
if (__DEV__) {
  // A basic middleware logger
  middlewares.push(logger);
}

export default middlewares;
