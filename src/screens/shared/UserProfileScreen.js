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
import { ClientContext } from '../../context/ClientContext';
import { TrainerContext } from '../../context/TrainerContext';
import { AuthContext } from '../../context/AuthContext';
import { VideoCallContext } from '../../context/VideoCallContext';

const UserProfileScreen = ({ route }) => {
  const { colors } = useTheme();
  const { userID } = route.params;
  const { userInfo } = useContext(AuthContext);
  const { getUserInfo } =
    userInfo.type === 'client'
      ? useContext(ClientContext)
      : useContext(TrainerContext);
  const { create } =
    userInfo.type === 'client' ? useContext(VideoCallContext) : {};
  const [profileInfo, setProfileInfo] = useState({});
  const [initials, setInitials] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const user = await getUserInfo(userID);
      setProfileInfo(user);
      setInitials(getInitials(user.full_name));
    };
    fetchData();
  }, []);

  const getInitials = string => {
    const names = string.split(' ');
    let initials = names[0].substring(0, 1).toUpperCase();

    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <View style={styles.headerContainer}>
          <View
            style={[
              styles.userHeaderContainer,
              userInfo.type === 'client' ? { width: '75%' } : { width: '100%' },
            ]}
          >
            <Avatar.Text label={initials} />
            <View style={styles.userSubheadingContainer}>
              <Subheading>{`${profileInfo.full_name} (${profileInfo.username})`}</Subheading>
              <Text>{profileInfo.type}</Text>
            </View>
          </View>
          {userInfo.type === 'client' ? (
            <View style={styles.callContainer}>
              <IconButton
                icon="phone"
                color={colors.primary}
                size={32}
                onPress={() => {
                  create(profileInfo.username, profileInfo.full_name);
                }}
              />
            </View>
          ) : null}
        </View>
        <View style={styles.contentContainer}>
          <Subheading style={{ color: colors.primary }}>Description</Subheading>
          <Paragraph style={{ textAlign: 'justify' }}>
            {profileInfo.description
              ? profileInfo.description
              : 'No information given...'}
          </Paragraph>
          <View style={{ height: 10 }}></View>
          <Subheading style={{ color: colors.primary }}>Contact</Subheading>
          <Paragraph>
            <Text style={{ fontWeight: 'bold' }}>E-mail: </Text>
            {profileInfo.email + '\n'}
            <Text style={{ fontWeight: 'bold' }}>Phone number: </Text>
            {profileInfo.phone_number}
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
