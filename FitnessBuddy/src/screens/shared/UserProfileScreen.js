import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import {
  IconButton,
  Text,
  Avatar,
  Subheading,
  useTheme,
  Paragraph,
} from 'react-native-paper';
import { SharedContext } from '../../context/SharedContext';

const UserProfileScreen = ({ route, navigation }) => {
  const { colors } = useTheme();
  const { userID } = route.params;
  const { getUserInfo } = useContext(SharedContext);
  const [userInfo, setUserInfo] = useState({});
  const [initials, setInitials] = useState('');

  useEffect(async () => {
    const user = await getUserInfo(userID);
    setUserInfo(user);
    setInitials(getInitials(user.full_name));
  }, []);

  const getInitials = string => {
    var names = string.split(' '),
      initials = names[0].substring(0, 1).toUpperCase();

    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <View style={styles.headerContainer}>
          <View style={styles.userHeaderContainer}>
            <Avatar.Text label={initials} />
            <View style={styles.userSubheadingContainer}>
              <Subheading>{`${userInfo.full_name} (${userInfo.username})`}</Subheading>
              <Text>{userInfo.type}</Text>
            </View>
          </View>
          <View style={styles.callContainer}>
            <IconButton icon="phone" color={colors.primary} size={32} />
          </View>
        </View>
        <View style={styles.contentContainer}>
          <Subheading style={{ color: colors.primary }}>Description</Subheading>
          <Paragraph style={{ textAlign: 'justify' }}>
            {userInfo.description
              ? userInfo.description
              : 'Tell others about yourself...'}
          </Paragraph>
          <View style={{ height: 10 }}></View>
          <Subheading style={{ color: colors.primary }}>Contact</Subheading>
          <Paragraph>
            <Text style={{ fontWeight: 'bold' }}>E-mail: </Text>
            {userInfo.email + '\n'}
            <Text style={{ fontWeight: 'bold' }}>Phone number: </Text>
            {userInfo.phone_number}
          </Paragraph>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

export default UserProfileScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '75%',
  },
  userSubheadingContainer: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  callContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    paddingVertical: 24,
  },
  editButton: {
    position: 'absolute',
    margin: 24,
    right: 0,
    bottom: 0,
  },
  editCancelButton: {
    position: 'absolute',
    marginVertical: 24,
    marginLeft: 24,
    marginRight: 100,
    right: 0,
    bottom: 0,
  },
});
