import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { AuthContext } from '../../context/AuthContext';

const MealListScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Meal list screen</Text>
    </View>
  );
};

export default MealListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
});
