import { DefaultTheme } from 'react-native-paper';

const primaryColor = '#85A833';

const colors = {
  primaryColor,
};

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: primaryColor,
    accent: primaryColor,
  },
};

export { colors, theme };
