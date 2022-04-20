import React, { useState, useEffect, createContext } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '../config';

// source code: https://github.com/samironbarai/rn-auth/blob/main/src/context/AuthContext.js

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
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
      })
      .catch(e => {
        const res = e.response.data;
        let errMsg = '';
        if (res.username) errMsg += res.username;
        if (res.email) errMsg += '\n' + res.email;
        if (res.phone_number) errMsg += '\n' + res.phone_number;

        Alert.alert('Register error!', errMsg, [{ text: 'Okay' }]);
      });
  };

  const login = (username, password) => {
    axios
      .post(`${BASE_URL}/user/login`, {
        username,
        password,
      })
      .then(res => {
        let userInfo = res.data;
        setUserInfo(userInfo);
        AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
      })
      .catch(e => {
        Alert.alert('Invalid user!', 'Username or password is incorrect.', [
          { text: 'Okay' },
        ]);
      });
  };

  const logout = () => {
    axios
      .delete(`${BASE_URL}/user/logout`, {
        headers: { Authorization: `Token ${userInfo.token}` },
      })
      .then(res => {
        AsyncStorage.removeItem('userInfo');
        setUserInfo({});
      })
      .catch(e => {
        if (e.response.status === 401) {              //pridat
          AsyncStorage.removeItem('userInfo');
          setUserInfo({});
          return;
        }
        Alert.alert('Logout error!', `${e}`, [{ text: 'Okay' }]);
      });
  };

  const updateProfile = (email, phone_number, description) => {
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
      })
      .catch(e => {
        if (e.response.status === 401) { //pridat
          logout();
          return;
        }
        const res = e.response.data;
        let errMsg = '';
        if (res.email) errMsg += '\n' + res.email;
        if (res.phone_number) errMsg += '\n' + res.phone_number;
        Alert.alert('Update profile error!', errMsg, [{ text: 'Okay' }]);
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
      logout();
      setSplashLoading(false);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

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
