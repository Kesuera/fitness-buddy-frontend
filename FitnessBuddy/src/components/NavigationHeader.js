import React, { useContext } from 'react';
import { Appbar, useTheme } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';

const NavigationHeader = ({ title, navigation = null, goBack = null }) => {
  const { colors } = useTheme();
  const { logout } = useContext(AuthContext);

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
      {title === 'You' ? (
        <Appbar.Action icon="logout" onPress={() => logout()} />
      ) : null}
    </Appbar.Header>
  );
};

export default NavigationHeader;
