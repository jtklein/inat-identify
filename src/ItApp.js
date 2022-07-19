import React from 'react';
import * as Expo from 'expo';
import { Provider } from 'react-redux';
import { Provider as PaperProvider } from 'react-native-paper';
import { enableScreens } from 'react-native-screens';
import { PersistGate } from 'redux-persist/integration/react';
import { en, registerTranslation } from 'react-native-paper-dates';

import configureStore from './store';

import ItAppContainer from './ItAppContainer';

import { theme } from './styles';
import { LogBox } from 'react-native';

if (!__DEV__) {
  console.log = () => {};
}

LogBox.ignoreAllLogs();

enableScreens();

const { store, persistor } = configureStore();

registerTranslation('en', en);

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
