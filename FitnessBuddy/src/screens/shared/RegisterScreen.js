import React, { useState, useContext } from 'react';
import { StyleSheet, View, KeyboardAvoidingView } from 'react-native';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';
import DropDown from 'react-native-paper-dropdown';
import { AuthContext } from '../../context/AuthContext';

const RegisterScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [showDropDown, setShowDropDown] = useState(false);
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
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userType, setUserType] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <View style={styles.container} behavior="padding">
        <Text style={styles.heading}>Register</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputMargin}
            label="Username"
            mode="outlined"
            autoCorrect={false}
            value={username}
            onChangeText={text => setUsername(text)}
          />
          <TextInput
            style={styles.inputMargin}
            label="Full name"
            mode="outlined"
            value={fullName}
            onChangeText={text => setFullName(text)}
          />
          <TextInput
            style={styles.inputMargin}
            keyboardType="email-address"
            label="E-mail"
            mode="outlined"
            autoCorrect={false}
            value={email}
            onChangeText={text => setEmail(text)}
          />
          <TextInput
            style={styles.inputMargin}
            keyboardType="phone-pad"
            label="Phone number"
            mode="outlined"
            value={phoneNumber}
            onChangeText={text => setPhoneNumber(text)}
          />
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
            onChangeText={text => setPassword(text)}
            secureTextEntry
          />
          <TextInput
            style={styles.inputMargin}
            label="Confirm password"
            mode="outlined"
            autoCorrect={false}
            value={confirmPassword}
            onChangeText={text => setConfirmPassword(text)}
            secureTextEntry
          />
        </View>
        <Button
          style={styles.buttonContainer}
          mode="contained"
          onPress={() => {
            register(
              username,
              fullName,
              email,
              phoneNumber,
              userType,
              password,
              confirmPassword
            );
          }}
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
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
