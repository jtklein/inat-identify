import { DefaultTheme } from 'react-native-paper';

const primaryColor = '#85A833';
const transparentPrimaryColor = 'rgba(133, 168, 51, 0.3)';
const textColor = '#555555';
const disabledColor = '#DDDDDD';

const colors = {
  primaryColor,
  transparentPrimaryColor,
  textColor,
  disabledColor,
};

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: primaryColor,
    accent: primaryColor,
    text: textColor,
    disabled: disabledColor,
  },
};

export { colors, theme };
