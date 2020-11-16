import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { colors } from '../../../styles';

const { textColor } = colors;

/**
 * The primary styled text for the app.
 * @param {string} size String indicating the size: 'small' or 'large'
 */
const ItText = (props) => {
  const { defaultStyle } = styles;
  const { children } = props;
  return (
    <Text {...props} style={[{ color: textColor }, defaultStyle]}>{children}</Text>
  );
};

const styles = StyleSheet.create({
  defaultStyle: {
    color: textColor,
  },
});

export { ItText };
