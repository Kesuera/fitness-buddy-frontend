import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Button,
  IconButton,
  Text,
  Avatar,
  Subheading,
  useTheme,
  Paragraph,
} from 'react-native-paper';
import Spinner from 'react-native-loading-spinner-overlay';
import { AuthContext } from '../../context/AuthContext';

const YouScreen = () => {
  const { colors } = useTheme();
  const { userInfo, isLoading, logout } = useContext(AuthContext);

  const getInitials = string => {
    var names = string.split(' '),
      initials = names[0].substring(0, 1).toUpperCase();

    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
  };

  const initials = getInitials(userInfo.full_name);

  return (
    <View style={styles.container}>
      <Spinner visible={isLoading} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={styles.headerContainer}>
          <Avatar.Text label={initials} />
          <View style={styles.subHeadingContainer}>
            <Subheading>{`${userInfo.full_name} (${userInfo.username})`}</Subheading>
            <Text>{userInfo.type}</Text>
          </View>
        </View>
        <View style={styles.callContainer}>
          <IconButton icon="phone" color={colors.primary} size={32} />
        </View>
      </View>
      <View style={styles.detailedInfoContainer}>
        <Subheading style={{ color: colors.primary }}>Description</Subheading>
        <Paragraph>
          {userInfo.description
            ? userInfo.description
            : 'Tell others about yourself...'}
        </Paragraph>
        <View style={{ height: 12 }}></View>
        <Subheading style={{ color: colors.primary }}>Contact</Subheading>
        <Paragraph>{`E-mail: ${userInfo.email}\nPhone number: ${userInfo.phone_number}`}</Paragraph>
      </View>
      <Button onPress={logout}>Logout</Button>
    </View>
  );
};

export default YouScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '75%',
  },
  subHeadingContainer: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  callContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailedInfoContainer: {
    flex: 1,
    paddingVertical: 24,
  },
});
