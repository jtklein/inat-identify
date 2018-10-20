import React from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';

const ItScreenContainer = props => {
  const { children } = props;

  return (
    <View {...props} style={styles.container}>
      <StatusBar
        barStyle={props.barStyle || 'light-content'}
      />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF'
  }
});

export { ItScreenContainer };