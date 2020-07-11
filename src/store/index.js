import { compose, createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';

import rootReducer from '../reducers';
import middlewares from '../middleware';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['swiper'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default () => {
  const store = createStore(
    persistedReducer,
    undefined,
    compose(applyMiddleware(...middlewares)),
  );
  const persistor = persistStore(store);
  return { store, persistor };
};
