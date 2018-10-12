import React from 'react';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

import IiAppNavigator from './src/IiAppNavigator';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#85A833'
  }
};

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
