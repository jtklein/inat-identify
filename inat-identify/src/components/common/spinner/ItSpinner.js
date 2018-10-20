import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';

import { colors } from '../../../styles';

/**
 * The primary styled spinner for the app.
 * @param {string} size String indicating the size: 'small' or 'large'
 */
const ItSpinner = ({ size, color }) => {
  const { primaryColor } = colors;
  return (
    <View style={styles.spinner}>
      <ActivityIndicator size={size} color={color || primaryColor} />
    </View>
  );
};

const styles = StyleSheet.create({
  spinner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export { ItSpinner };
