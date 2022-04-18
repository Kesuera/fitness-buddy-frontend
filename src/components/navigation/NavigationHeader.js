import React, { useContext } from 'react';
import { Appbar, useTheme } from 'react-native-paper';
import { AuthContext } from '../../context/AuthContext';

// source code: https://github.com/amaialth/react-nav5/blob/master/src/navigation/util/StackHeader.js
const NavigationHeader = ({ title, navigation, goBack = null }) => {
  const { colors } = useTheme();
  const { logout } = useContext(AuthContext);

  return (
    <Appbar.Header
      style={{
        backgroundColor: colors.primary,
      }}
      statusBarHeight={0}
    >
      {navigation?.canGoBack() ? (
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
