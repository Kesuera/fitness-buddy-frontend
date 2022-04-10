import React, { useState, useEffect, createContext } from 'react';
import { View, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay';
import { BASE_URL } from '../config';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [splashLoading, setSplashLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({});

  const register = (
    username,
    full_name,
    email,
    phone_number,
    type,
    password,
    password_again
  ) => {
    setIsLoading(true);

    axios
      .post(`${BASE_URL}/user/register`, {
        username,
        full_name,
        email,
        phone_number,
        type,
        password,
        password_again,
      })
      .then(res => {
        let userInfo = res.data;
        setUserInfo(userInfo);
        AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
        console.log(userInfo);
        setIsLoading(false);
      })
      .catch(e => {
        const res = e.response.data;
        let errMsg = '';
        if (res.username) errMsg += res.username;
        if (res.email) errMsg += '\n' + res.email;
        if (res.phone_number) errMsg += '\n' + res.phone_number;

        Alert.alert('Register error!', errMsg, [{ text: 'Okay' }]);
        setIsLoading(false);
      });
  };

  const login = (username, password) => {
    setIsLoading(true);

    axios
      .post(`${BASE_URL}/user/login`, {
        username,
        password,
      })
      .then(res => {
        let userInfo = res.data;
        setUserInfo(userInfo);
        AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
        console.log(userInfo);
        setIsLoading(false);
      })
      .catch(e => {
        console.log(`Login error ${e}`);
        setIsLoading(false);
        Alert.alert('Invalid user!', 'Username or password is incorrect.', [
          { text: 'Okay' },
        ]);
      });
  };

  const logout = () => {
    setIsLoading(true);

    axios
      .delete(`${BASE_URL}/user/logout`, {
        headers: { Authorization: `Token ${userInfo.token}` },
      })
      .then(res => {
        console.log(res.data);
        AsyncStorage.removeItem('userInfo');
        setUserInfo({});
        setIsLoading(false);
      })
      .catch(e => {
        console.log(`logout error ${e}`);
        setIsLoading(false);
      });
  };

  const updateProfile = async (email, phone_number, description) => {
    setIsLoading(true);

    axios
      .put(
        `${BASE_URL}/user/update`,
        {
          email,
          phone_number,
          description,
        },
        {
          headers: { Authorization: `Token ${userInfo.token}` },
        }
      )
      .then(async () => {
        let userInfo = await AsyncStorage.getItem('userInfo');
        userInfo = JSON.parse(userInfo);

        userInfo.email = email;
        userInfo.phone_number = phone_number;
        userInfo.description = description;

        setUserInfo(userInfo);
        AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
        setIsLoading(false);
      })
      .catch(e => {
        const res = e.response.data;
        let errMsg = '';
        if (res.email) errMsg += '\n' + res.email;
        if (res.phone_number) errMsg += '\n' + res.phone_number;

        Alert.alert('Update profile error!', errMsg, [{ text: 'Okay' }]);

        setIsLoading(false);
      });
  };

  const isLoggedIn = async () => {
    setSplashLoading(true);

    try {
      let userInfo = await AsyncStorage.getItem('userInfo');
      userInfo = JSON.parse(userInfo);

      if (userInfo) {
        setUserInfo(userInfo);
      }
      setSplashLoading(false);
    } catch (e) {
      console.log(`is logged in error ${e}`);
      setSplashLoading(false);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1 }}>
        <Spinner visible={true} />
      </View>
    );
  }
  return (
    <AuthContext.Provider
      value={{
        userInfo,
        splashLoading,
        register,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
