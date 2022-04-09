import React, { useState, useContext } from 'react';
import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';
import DropDown from 'react-native-paper-dropdown';
import { AuthContext } from '../../context/AuthContext';
import ValidationError from '../../components/ValidationError';
import Validator from '../../components/Validator';

const RegisterScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { register } = useContext(AuthContext);
  const userTypeList = [
    {
      label: 'Client',
      value: 'client',
    },
    {
      label: 'Trainer',
      value: 'trainer',
    },
  ];
  const [username, setUsername] = useState('');
  const [isValidUsername, setIsValidUsername] = useState(true);
  const [fullName, setFullName] = useState('');
  const [isValidFullname, setIsValidFullname] = useState(true);
  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(true);
  const [userType, setUserType] = useState('');
  const [password, setPassword] = useState('');
  const [isValidPassword, setIsValidPassword] = useState(true);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isValidConfirmPassword, setIsValidConfirmPassword] = useState(true);
  const [showDropDown, setShowDropDown] = useState(false);

  const handleUsernameChange = text => {
    if ((text = Validator.validateUsername(text))) {
      setIsValidUsername(true);
      setUsername(text);
    } else setIsValidUsername(false);
  };

  const handleFullnameChange = text => {
    if ((text = Validator.validateFullName(text))) {
      setFullName(text);
      setIsValidFullname(true);
    } else setIsValidFullname(false);
  };

  const handleEmailChange = text => {
    if ((text = Validator.validateEmail)) {
      setEmail(text);
      setIsValidEmail(true);
    } else setIsValidEmail(false);
  };

  const handlePhoneNumberChange = text => {
    if ((text = Validator.validiatePhoneNumber)) {
      setPhoneNumber(text);
      setIsValidPhoneNumber(true);
    } else setIsValidPhoneNumber(false);
  };

  const handlePasswordChange = text => {
    if ((text = Validator.validatePassword(text))) {
      setPassword(text);
      setIsValidPassword(true);
    } else setIsValidPassword(false);
    if (confirmPassword && text != confirmPassword)
      setIsValidConfirmPassword(false);
    else setIsValidConfirmPassword(true);
  };

  const handleConfirmPasswordChange = text => {
    text = text.replace(/\s/g, '');
    if (text === password) {
      setConfirmPassword(text);
      setIsValidConfirmPassword(true);
    } else setIsValidConfirmPassword(false);
  };

  const handleRegister = () => {
    if (
      username &&
      fullName &&
      email &&
      phoneNumber &&
      userType &&
      password &&
      confirmPassword
    ) {
      if (
        isValidUsername &&
        isValidFullname &&
        isValidEmail &&
        isValidPhoneNumber &&
        isValidPassword &&
        isValidConfirmPassword
      ) {
        register(
          username,
          fullName,
          email,
          phoneNumber,
          userType,
          password,
          confirmPassword
        );
      }
    }
    Alert.alert('Wrong input!', 'Check if all fields are correct.', [
      { text: 'Okay' },
    ]);
  };

  return (
    <ScrollView contentContainerstyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <Text style={styles.heading}>Register</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputMargin}
            label="Username"
            mode="outlined"
            autoCorrect={false}
            value={username}
            onChangeText={text => handleUsernameChange(text)}
          />
          {isValidUsername ? null : (
            <ValidationError
              errorMsg={
                'Username must be 4-100 characters long and only contain numbers and letters.'
              }
            />
          )}
          <TextInput
            style={styles.inputMargin}
            label="Full name"
            mode="outlined"
            value={fullName}
            onChangeText={text => handleFullnameChange(text)}
          />
          {isValidFullname ? null : (
            <ValidationError
              errorMsg={
                'Full name must be 4-100 characters long and only contain letters.'
              }
            />
          )}
          <TextInput
            style={styles.inputMargin}
            keyboardType="email-address"
            label="E-mail"
            mode="outlined"
            autoCorrect={false}
            value={email}
            onChangeText={text => handleEmailChange(text)}
          />
          {isValidEmail ? null : (
            <ValidationError errorMsg={'Invalid e-mail.'} />
          )}
          <TextInput
            style={styles.inputMargin}
            keyboardType="phone-pad"
            label="Phone number"
            mode="outlined"
            autoCorrect={false}
            value={phoneNumber}
            onChangeText={text => handlePhoneNumberChange(text)}
            placeholder="+421xxxxxxxxx"
          />
          {isValidPhoneNumber ? null : (
            <ValidationError
              errorMsg={'Invalid phone number (+421xxxxxxxxx).'}
            />
          )}
          <View style={styles.inputMargin} />
          <DropDown
            label={'User type'}
            mode={'outlined'}
            visible={showDropDown}
            showDropDown={() => setShowDropDown(true)}
            onDismiss={() => setShowDropDown(false)}
            value={userType}
            setValue={setUserType}
            list={userTypeList}
          />
          <TextInput
            style={styles.inputMargin}
            label="Password"
            mode="outlined"
            autoCorrect={false}
            value={password}
            onChangeText={text => handlePasswordChange(text)}
            secureTextEntry
          />
          {isValidPassword ? null : (
            <ValidationError
              errorMsg={'Password must be 6-256 characters long.'}
            />
          )}
          <TextInput
            style={styles.inputMargin}
            label="Confirm password"
            mode="outlined"
            autoCorrect={false}
            value={confirmPassword}
            onChangeText={text => handleConfirmPasswordChange(text)}
            secureTextEntry
          />
          {isValidConfirmPassword ? null : (
            <ValidationError errorMsg={'Passwords do not match.'} />
          )}
        </View>
        <Button
          style={styles.buttonContainer}
          mode="contained"
          onPress={() => handleRegister()}
        >
          Register
        </Button>
        <Text>
          Already have an Account?
          <Text
            style={{ color: colors.primary }}
            onPress={() => navigation.navigate('Login')}
          >
            {' '}
            Login
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  heading: {
    fontSize: 40,
    marginBottom: 10,
  },
  inputContainer: {
    width: '70%',
  },
  inputMargin: {
    marginTop: 5,
  },
  buttonContainer: {
    width: '35%',
    marginTop: 20,
    marginBottom: 10,
  },
});
