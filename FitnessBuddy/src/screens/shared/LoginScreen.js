import React, { useState, useContext } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';
import { AuthContext } from '../../context/AuthContext';

const LoginScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = text => {
    text = text.replace(/\s/g, '').toLowerCase();
    setUsername(text);
  };

  const handlePasswordChange = text => {
    text = text.replace(/\s/g, '');
    setPassword(text);
  };

  const handleLogin = () => {
    if (!username || !password) {
      Alert.alert(
        'Wrong input!',
        'Username or password field cannot be empty.',
        [{ text: 'Okay' }]
      );
      return;
    }
    login(username, password);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Login</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputMargin}
          label="Username"
          autoCorrect={false}
          mode="outlined"
          value={username}
          onChangeText={text => handleUsernameChange(text)}
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
      </View>
      <Button
        style={styles.buttonContainer}
        mode="contained"
        onPress={() => {
          handleLogin();
        }}
      >
        Login
      </Button>
      <View style={styles.registerNav}>
        <Text>
          Don't have an Account?
          <Text
            style={{ color: colors.primary }}
            onPress={() => navigation.navigate('Register')}
          >
            {' '}
            Register
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default LoginScreen;

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
    width: '75%',
  },
  inputMargin: {
    marginTop: 5,
  },
  buttonContainer: {
    width: '35%',
    marginTop: 20,
    marginBottom: 10,
  },
  registerNav: {
    flexDirection: 'row',
  },
  modalContainer: {
    flex: 1,

    alignItems: 'center',
    justifyContent: 'center',
  },
});
