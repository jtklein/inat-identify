import React from 'react';
import * as Expo from 'expo';
import { Provider } from 'react-redux';
import { Provider as PaperProvider } from 'react-native-paper';
import { PersistGate } from 'redux-persist/integration/react';
import configureStore from './store';

import ItAppContainer from './ItAppContainer';

import { theme } from './styles';

if (!__DEV__) {
  console.log = () => {};
}

const { store, persistor } = configureStore();

class ItApp extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <PaperProvider theme={theme}>
            <ItAppContainer />
          </PaperProvider>
        </PersistGate>
      </Provider>
    );
  }
}

Expo.registerRootComponent(ItApp);
