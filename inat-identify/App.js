import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';

import IiAppNavigator from './src/IiAppNavigator';

import { theme } from './src/styles';

if (!__DEV__) {
  console.log = () => { };
}

export default class App extends React.Component {
  render() {
    return (
      <PaperProvider theme={theme}>
        <IiAppNavigator />
      </PaperProvider>
    );
  }
}
