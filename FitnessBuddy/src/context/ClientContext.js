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
        let trainers = res.data;
        setTrainers(trainers);
      })
      .catch(e => {
        console.log(`get trainers error ${e}`);
      });
  };

  const getFavTrainers = () => {
    axios
      .get(`${BASE_URL}/user/favourites`, {
        headers: { Authorization: `Token ${userInfo.token}` },
      })
      .then(res => {
        let favTrainers = res.data;
        setFavTrainers(favTrainers);
      })
      .catch(e => {
        console.log(`get favourite trainers error ${e}`);
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
          const newObj = {
            trainer_id: trainer.id,
            trainer_username: trainer.username,
            trainer_full_name: trainer.full_name,
          };
          favTrainersCopy.push(newObj);
          favTrainersCopy.sort((a, b) =>
            strcmp(a.trainer_full_name, b.trainer_full_name)
          );
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
              getTrainers,
              getFavTrainers,
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
