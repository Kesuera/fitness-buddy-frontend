import React from 'react';
import { Text, useTheme } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';

const ValidationError = ({ errorMsg }) => {
  const { colors } = useTheme();

  return (
    <Animatable.View animation="fadeInLeft" duration={500}>
      <Text style={{ color: colors.error }}>{errorMsg}</Text>
    </Animatable.View>
  );
};

export default ValidationError;
