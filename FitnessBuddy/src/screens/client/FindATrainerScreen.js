import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { AuthContext } from '../../context/AuthContext';

const FindATrainerScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Find a trainer screen</Text>
    </View>
  );
};

export default FindATrainerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
});
