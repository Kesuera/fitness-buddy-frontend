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

  const getUserInfo = userID => {
    const stack = followers;
    const index = stack.findIndex(follower => follower.client_id === userID);

    if (index !== -1 && stack[index].type) {
      const data = {
        id: stack[index].client_id,
        type: stack[index].type,
        username: stack[index].client_username,
        full_name: stack[index].client_full_name,
        email: stack[index].email,
        phone_number: stack[index].phone_number,
        description: stack[index].description,
      };
      return data;
    }

    return axios
      .get(`${BASE_URL}/user/${userID}`, {
        headers: { Authorization: `Token ${userInfo.token}` },
      })
      .then(res => {
        const data = res.data;
        stack[index].type = data.type;
        stack[index].email = data.email;
        stack[index].phone_number = data.phone_number;
        stack[index].description = data.description;
        setFollowers(stack);
        return data;
      })
      .catch(e => {
        console.log(`get user info error ${e}`);
      });
  };

  return (
    <TrainerContext.Provider
      value={
        userInfo.type == 'trainer'
          ? {
              followers,
              getFollowers,
              getUserInfo,
            }
          : null
      }
    >
      {children}
    </TrainerContext.Provider>
  );
};
