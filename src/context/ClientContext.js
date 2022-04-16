import React, { useState, createContext, useContext } from 'react';
import axios from 'axios';
import { BASE_URL } from '../config';
import { AuthContext } from './AuthContext';

export const ClientContext = createContext();

export const ClientProvider = ({ children }) => {
  const [trainers, setTrainers] = useState([]);
  const [favTrainers, setFavTrainers] = useState([]);
  const { userInfo } = useContext(AuthContext);

  const getTrainers = () => {
    axios
      .get(`${BASE_URL}/user/trainer`, {
        headers: { Authorization: `Token ${userInfo.token}` },
      })
      .then(res => {
        const trainers = res.data;
        const favTrainers = trainers.filter(trainer => trainer.is_fav);
        setTrainers(trainers);
        setFavTrainers(favTrainers);
      })
      .catch(e => {
        console.log(`get trainers error ${e}`);
      });
  };

  const getUserInfo = userID => {
    const stack = trainers;
    const index = stack.findIndex(trainer => trainer.id === userID);

    if (index !== -1 && stack[index].type) {
      return stack[index];
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
        setTrainers(stack);
        return data;
      })
      .catch(e => {
        console.log(`get user info error ${e}`);
      });
  };

  const followTrainer = trainer_id => {
    const strcmp = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

    axios
      .post(
        `${BASE_URL}/user/favourites/follow/${trainer_id}`,
        {},
        {
          headers: { Authorization: `Token ${userInfo.token}` },
        }
      )
      .then(() => {
        const index = trainers.findIndex(trainer => trainer.id === trainer_id);
        const favIndex =
          favTrainers.length !== 0
            ? favTrainers.findIndex(
                trainer => trainer.trainer_id === trainer_id
              )
            : -1;
        if (favIndex === -1) {
          const favTrainersCopy = [...favTrainers];
          const trainer = trainers[index];
          favTrainersCopy.push(trainer);
          favTrainersCopy.sort((a, b) => strcmp(a.full_name, b.full_name));
          setFavTrainers(favTrainersCopy);
        }

        const trainersCopy = [...trainers];
        trainersCopy[index].is_fav = true;
        setTrainers(trainersCopy);
      })
      .catch(e => {
        console.log(`follow trainer error ${e}`);
      });
  };

  const unfollowTrainer = trainer_id => {
    axios
      .delete(`${BASE_URL}/user/favourites/unfollow/${trainer_id}`, {
        headers: { Authorization: `Token ${userInfo.token}` },
      })
      .then(() => {
        if (favTrainers.length !== 0) {
          const data = [...favTrainers];
          const index = favTrainers.findIndex(
            trainer => trainer.id === trainer_id
          );
          data.splice(index, 1);
          setFavTrainers(data);
        }

        if (trainers.length !== 0) {
          const data = [...trainers];
          const index = trainers.findIndex(
            trainer => trainer.id === trainer_id
          );
          data[index].is_fav = false;
          setTrainers(data);
        }
      })
      .catch(e => {
        console.log(`unfollow trainer error ${e}`);
      });
  };

  return (
    <ClientContext.Provider
      value={
        userInfo.type === 'client'
          ? {
              trainers,
              favTrainers,
              getUserInfo,
              getTrainers,
              followTrainer,
              unfollowTrainer,
            }
          : null
      }
    >
      {children}
    </ClientContext.Provider>
  );
};
