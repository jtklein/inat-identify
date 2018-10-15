import { compose, createStore, applyMiddleware } from 'redux';

import rootReducer from '../reducers';
import middlewares from '../middleware';

export default function configureStore() {
  const store = createStore(
    rootReducer,
    undefined,
    compose(
      applyMiddleware(...middlewares)
    )
  );
  return store;
}
