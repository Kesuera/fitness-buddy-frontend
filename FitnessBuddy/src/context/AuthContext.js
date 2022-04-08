import React, { useState, useEffect, createContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '../config';

export const AuthContext = createContext(null);

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
      })
      .catch(e => {
        console.log(`register error ${e}`);
      });

    setIsLoading(false);
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
      })
      .catch(e => {
        console.log(`register error ${e}`);
      });

    setIsLoading(false);
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
      })
      .catch(e => {
        console.log(`logout error ${e}`);
      });

    setIsLoading(false);
  };

  const isLoggedIn = async () => {
    setSplashLoading(true);

    try {
      let userInfo = await AsyncStorage.getItem('userInfo');
      userInfo = JSON.parse(userInfo);

      if (userInfo) {
        setUserInfo(userInfo);
      }
    } catch (e) {
      console.log(`is logged in error ${e}`);
    }

    setSplashLoading(false);
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        userInfo,
        splashLoading,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
