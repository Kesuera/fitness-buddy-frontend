import React, { useContext, useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Keyboard, Alert } from 'react-native';
import {
  Text,
  Avatar,
  Subheading,
  useTheme,
  Paragraph,
  FAB,
  TextInput,
} from 'react-native-paper';
import { AuthContext } from '../../context/AuthContext';
import ValidationError from '../../components/validation/ValidationError';
import Validator from '../../components/validation/Validator';

const YouScreen = () => {
  const { colors } = useTheme();
  const { userInfo, updateProfile } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [email, setEmail] = useState(userInfo.email);
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState(userInfo.phone_number);
  const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(true);
  const [description, setDescription] = useState(userInfo.description);
  const [isValidDescription, setIsValidDescription] = useState(
    userInfo.description ? true : false
  );
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardOpen(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardOpen(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const getInitials = string => {
    var names = string.split(' '),
      initials = names[0].substring(0, 1).toUpperCase();

    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
  };

  const initials = getInitials(userInfo.full_name);

  const handleDescriptionChange = text => {
    if ((text = Validator.validateDescription(text))) {
      setDescription(text);
      setIsValidDescription(true);
    } else setIsValidDescription(false);
  };

  const handleEmailChange = text => {
    if ((text = Validator.validateEmail(text))) {
      setEmail(text);
      setIsValidEmail(true);
    } else setIsValidEmail(false);
  };

  const handlePhoneNumberChange = text => {
    if ((text = Validator.validiatePhoneNumber(text))) {
      setPhoneNumber(text);
      setIsValidPhoneNumber(true);
    } else setIsValidPhoneNumber(false);
  };

  const handleUpdateProfile = () => {
    if (isValidEmail && isValidPhoneNumber && isValidDescription) {
      if (
        email != userInfo.email ||
        phoneNumber != userInfo.phone_number ||
        description != userInfo.description
      )
        updateProfile(email, phoneNumber, description);

      setIsEditing(!isEditing);
    } else {
      Alert.alert('Wrong input!', 'Check if all fields are correct.', [
        { text: 'Okay' },
      ]);
    }
  };

  const handleEditCancel = () => {
    setDescription(userInfo.description);
    setEmail(userInfo.email);
    setPhoneNumber(userInfo.phone_number);
    setIsEditing(!isEditing);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.headerContainer}>
          <View style={styles.userHeaderContainer}>
            <Avatar.Text label={initials} />
            <View style={styles.userSubheadingContainer}>
              <Subheading>{`${userInfo.full_name} (${userInfo.username})`}</Subheading>
              <Text>{userInfo.type}</Text>
            </View>
          </View>
        </View>
        <View style={styles.contentContainer}>
          <Subheading style={{ color: colors.primary }}>Description</Subheading>

          {isEditing ? (
            <>
              <TextInput
                onSubmitEditing={Keyboard.dismiss}
                mode="outlined"
                value={description}
                onChangeText={text => handleDescriptionChange(text)}
                style={{
                  height: 100,
                }}
                multiline
              />
              {isValidDescription ? null : (
                <ValidationError
                  errorMsg={'Description must be 10-500 characters long.'}
                />
              )}
            </>
          ) : (
            <Paragraph style={{ textAlign: 'justify' }}>
              {userInfo.description
                ? userInfo.description
                : 'Tell others about yourself...'}
            </Paragraph>
          )}

          <View style={{ height: 10 }}></View>
          <Subheading style={{ color: colors.primary }}>Contact</Subheading>

          {isEditing ? (
            <>
              <TextInput
                onSubmitEditing={Keyboard.dismiss}
                keyboardType="visible-password"
                label="E-mail"
                mode="outlined"
                value={email}
                autoCorrect={false}
                onChangeText={text => handleEmailChange(text)}
                style={{ marginTop: 5, height: 50 }}
              />
              {isValidEmail ? null : (
                <ValidationError errorMsg={'Invalid e-mail.'} />
              )}
              <TextInput
                onSubmitEditing={Keyboard.dismiss}
                keyboardType="phone-pad"
                label="Phone number"
                mode="outlined"
                value={phoneNumber}
                autoCorrect={false}
                onChangeText={text => handlePhoneNumberChange(text)}
                placeholder="+421xxxxxxxxx"
                style={{ marginTop: 10, height: 50 }}
              />
              {isValidPhoneNumber ? null : (
                <ValidationError
                  errorMsg={'Invalid phone number (+421xxxxxxxxx).'}
                />
              )}
            </>
          ) : (
            <Paragraph>
              <Text style={{ fontWeight: 'bold' }}>E-mail: </Text>
              {userInfo.email + '\n'}
              <Text style={{ fontWeight: 'bold' }}>Phone number: </Text>
              {userInfo.phone_number}
            </Paragraph>
          )}
        </View>
      </ScrollView>
      {isEditing && !keyboardOpen ? (
        <FAB
          style={[
            styles.editCancelButton,
            { backgroundColor: colors.background },
          ]}
          icon="close"
          onPress={() => handleEditCancel()}
        />
      ) : null}
      {!keyboardOpen ? (
        <FAB
          style={[styles.editButton, { backgroundColor: colors.primary }]}
          icon={isEditing ? 'check' : 'pencil'}
          onPress={() => {
            if (isEditing) handleUpdateProfile();
            else setIsEditing(!isEditing);
          }}
        />
      ) : null}
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
    justifyContent: 'space-between',
  },
  userHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
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
