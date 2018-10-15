import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';

import ItAppContainer from './ItAppContainer';

import { theme } from './styles';

if (!__DEV__) {
  console.log = () => {};
}

class ItApp extends React.Component {
  render() {
    return (

        <PaperProvider theme={theme}>
          <ItAppContainer />
        </PaperProvider>
    );
  }
}

Expo.registerRootComponent(ItApp);
