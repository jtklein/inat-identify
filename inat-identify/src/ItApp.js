import React from 'react';
import Expo from 'expo';
import { Provider } from 'react-redux';
import { Provider as PaperProvider } from 'react-native-paper';

import ItAppContainer from './ItAppContainer';

import configureStore from './store';
import { theme } from './styles';

if (!__DEV__) {
  console.log = () => {};
}

const store = configureStore();

class ItApp extends React.Component {
  render() {
    return (

      <Provider store={store}>
        <PaperProvider theme={theme}>
          <ItAppContainer />
        </PaperProvider>
      </Provider>
    );
  }
}

Expo.registerRootComponent(ItApp);
