import React, { useState, useEffect, createContext, useContext } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '../config';
import { ConnectionContext } from './ConnectionContext';

// source code: https://github.com/samironbarai/rn-auth/blob/main/src/context/AuthContext.js

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { connection } = useContext(ConnectionContext);
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
    if (!connection) {
      Alert.alert('Error!', 'No internet connection.');
      return;
    }

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
    if (!connection) {
      Alert.alert('Error!', 'No internet connection.');
      return;
    }

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
    if (!connection) {
      AsyncStorage.multiRemove([
        'userInfo',
        'trainers',
        'favTrainers',
        'meals',
        'trainerMeals',
        'followers',
        'dataToSync',
      ]);
      setUserInfo({});
      return;
    }

    axios
      .delete(`${BASE_URL}/user/logout`, {
        headers: { Authorization: `Token ${userInfo.token}` },
      })
      .then(res => {
        AsyncStorage.multiRemove([
          'userInfo',
          'trainers',
          'favTrainers',
          'meals',
          'trainerMeals',
          'followers',
          'dataToSync',
        ]);
        setUserInfo({});
      })
      .catch(e => {
        AsyncStorage.multiRemove([
          'userInfo',
          'trainers',
          'favTrainers',
          'meals',
          'trainerMeals',
          'followers',
          'dataToSync',
        ]);
        setUserInfo({});
        return;
      });
  };

  const updateProfile = (email, phone_number, description) => {
    if (!connection) {
      return;
    }

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
        if (e.response.status === 401) {
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
