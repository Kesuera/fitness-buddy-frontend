import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useTheme } from 'react-native-paper';

const SplashScreen = () => {
  const { colors } = useTheme();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: colors.primary,
      }}
    >
      <ActivityIndicator size="large" color="#ffffff" />
    </View>
  );
};

export default SplashScreen;
