import React, { useState, useContext } from 'react';
import { StyleSheet, View, KeyboardAvoidingView } from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Modal,
  Portal,
  useTheme,
} from 'react-native-paper';
import { AuthContext } from '../../context/AuthContext';

const LoginScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showError, setShowError] = useState(false);
  const { login } = useContext(AuthContext);

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <Portal>
        <Modal visible={showError} onDismiss={() => setShowError(false)}>
          <Text>Invalid username and password combination</Text>
        </Modal>
      </Portal>

      <View style={styles.container} behavior="padding">
        <Text style={styles.heading}>Login</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputMargin}
            label="Username"
            autoCorrect={false}
            mode="outlined"
            value={username}
            onChangeText={text => setUsername(text)}
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
        </View>
        <Button
          style={styles.buttonContainer}
          mode="contained"
          onPress={() => setShowError(login(username, password))}
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
