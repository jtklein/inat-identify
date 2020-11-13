import React from 'react';
import {
  StyleSheet, View, Platform, StatusBar,
} from 'react-native';

const ItScreenContainer = (props) => {
  const { barStyle, children } = props;
  const { container } = styles;

  return (
    <View {...props} style={container}>
      {Platform.OS === 'ios' && (
      <StatusBar
        barStyle={barStyle || 'light-content'}
      />
      )}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});

export { ItScreenContainer };
