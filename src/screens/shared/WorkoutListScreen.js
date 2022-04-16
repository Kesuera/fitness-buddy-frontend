import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { AuthContext } from '../../context/AuthContext';

const WorkoutListScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Workout list screen</Text>
    </View>
  );
};

export default WorkoutListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
});
