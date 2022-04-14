import React, { useState, createContext, useContext } from 'react';
import axios from 'axios';
import { BASE_URL } from '../config';
import { AuthContext } from './AuthContext';

export const TrainerContext = createContext();

export const TrainerProvider = ({ children }) => {
  const [followers, setFollowers] = useState([]);
  const { userInfo } = useContext(AuthContext);

  const getFollowers = () => {
    axios
      .get(`${BASE_URL}/user/favourites`, {
        headers: { Authorization: `Token ${userInfo.token}` },
      })
      .then(res => {
        let followers = res.data;
        setFollowers(followers);
      })
      .catch(e => {
        console.log(`get followers error ${e}`);
      });
  };

  return (
    <TrainerContext.Provider
      value={
        userInfo.type == 'trainer'
          ? {
              followers,
              getFollowers,
            }
          : null
      }
    >
      {children}
    </TrainerContext.Provider>
  );
};
