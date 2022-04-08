import React, { useState, useContext } from 'react';
import { StyleSheet, View, KeyboardAvoidingView } from 'react-native';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';
import Spinner from 'react-native-loading-spinner-overlay';
import { AuthContext } from '../../context/AuthContext';

const LoginScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { isLoading, login } = useContext(AuthContext);

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <Spinner visible={isLoading} />
      <View style={styles.container} behavior="padding">
        <Text style={styles.heading}>Login</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputMargin}
            label="Username"
            mode="outlined"
            value={username}
            onChangeText={text => setUsername(text)}
          />
          <TextInput
            style={styles.inputMargin}
            label="Password"
            mode="outlined"
            value={password}
            onChangeText={text => setPassword(text)}
            secureTextEntry
          />
        </View>
        <Button
          style={styles.buttonContainer}
          mode="contained"
          onPress={() => {
            login(username, password);
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
    </KeyboardAvoidingView>
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
});
