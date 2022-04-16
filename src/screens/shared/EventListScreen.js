import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { AuthContext } from '../../context/AuthContext';

const EventListScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Event list screen</Text>
    </View>
  );
};

export default EventListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
});
