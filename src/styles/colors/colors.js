import { DefaultTheme } from 'react-native-paper';

const primaryColor = '#85A833';
const transparentPrimaryColor = 'rgba(133, 168, 51, 0.3)';

const colors = {
  primaryColor,
  transparentPrimaryColor,
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
