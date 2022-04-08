import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import Spinner from 'react-native-loading-spinner-overlay';
import { AuthContext } from '../../context/AuthContext';

const FindATrainerScreen = ({ navigation }) => {
  const { isLoading } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Spinner visible={isLoading} />
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
