import React, { useState, createContext, useContext } from 'react';
import axios from 'axios';
import { BASE_URL } from '../config';
import { AuthContext } from './AuthContext';

export const SharedContext = createContext();

export const SharedProvider = ({ children }) => {
  const { userInfo } = useContext(AuthContext);

  const getUserInfo = userID => {
    return axios
      .get(`${BASE_URL}/user/${userID}`, {
        headers: { Authorization: `Token ${userInfo.token}` },
      })
      .then(res => {
        return res.data;
      })
      .catch(e => {
        console.log(`get user info error ${e}`);
      });
  };

  return (
    <SharedContext.Provider
      value={{
        getUserInfo,
      }}
    >
      {children}
    </SharedContext.Provider>
  );
};
