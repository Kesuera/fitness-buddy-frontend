import React from 'react';
import { Appbar, useTheme } from 'react-native-paper';

const NavigationHeader = ({ title, navigation = null, goBack = null }) => {
  const { colors } = useTheme();

  return (
    <Appbar.Header
      style={{ backgroundColor: colors.primary }}
      statusBarHeight={0}
    >
      {goBack ? (
        <Appbar.BackAction
          icon="arrow-left"
          onPress={() => {
            navigation.navigate(goBack);
          }}
        />
      ) : null}
      <Appbar.Content title={title} />
    </Appbar.Header>
  );
};

export default NavigationHeader;
