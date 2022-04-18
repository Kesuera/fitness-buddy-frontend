import React, { useState, createContext, useContext } from 'react';
import { Alert } from 'react-native';
import axios from 'axios';
import { BASE_URL } from '../config';
import { AuthContext } from './AuthContext';

export const ClientContext = createContext();

export const ClientProvider = ({ children }) => {
  const [trainers, setTrainers] = useState([]);
  const [favTrainers, setFavTrainers] = useState([]);
  const [meals, setMeals] = useState([]);
  const [trainerMeals, setTrainerMeals] = useState([]);
  const { userInfo } = useContext(AuthContext);

  const getMealInfo = mealID => {
    const stackMeals = [...meals];
    const stackTrainerMeals = [...trainerMeals];
    const indexMeals = stackMeals.findIndex(meal => meal.id === mealID);
    const indexTrainerMeals = stackTrainerMeals.findIndex(
      obj => obj.meals.findIndex(meal => meal.id === mealID) !== -1
    );
    let indexInTrainerMeals = -1;

    if (indexMeals !== -1 && stackMeals[indexMeals].trainer_username) {
      return stackMeals[indexMeals];
    }

    if (indexTrainerMeals !== -1) {
      indexInTrainerMeals = stackTrainerMeals[
        indexTrainerMeals
      ].meals.findIndex(meal => meal.id === mealID);
      if (
        indexInTrainerMeals !== -1 &&
        stackTrainerMeals[indexTrainerMeals].meals[indexInTrainerMeals]
          .trainer_username
      ) {
        return stackTrainerMeals[indexTrainerMeals].meals[indexInTrainerMeals];
      }
    }

    return axios
      .get(`${BASE_URL}/meal/${mealID}`, {
        headers: { Authorization: `Token ${userInfo.token}` },
      })
      .then(res => {
        stackMeals[indexMeals] = res.data;
        setMeals(stackMeals);

        if (indexInTrainerMeals !== -1) {
          stackTrainerMeals[indexTrainerMeals].meals[indexInTrainerMeals] =
            res.data;
          setTrainerMeals(stackTrainerMeals);
        }

        return res.data;
      })
      .catch(e => {
        if (indexMeals !== -1) {
          stackMeals.splice(indexMeals, 1);
          setMeals(stackMeals);
        }
        if (indexInTrainerMeals !== -1) {
          stackTrainerMeals[indexTrainerMeals].meals.splice(
            indexInTrainerMeals,
            1
          );
          setTrainerMeals(stackTrainerMeals);
        }
        return null;
      });
  };

  const getMeals = userID => {
    axios
      .get(`${BASE_URL}/meal/user/${userID ? userID : userInfo.id}`, {
        headers: { Authorization: `Token ${userInfo.token}` },
      })
      .then(res => {
        setMeals(res.data);
      })
      .catch(e => {
        Alert.alert('Meals error!', `${e}`, [{ text: 'Okay' }]);
      });
  };

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
        Alert.alert('Trainers error!', `${e}`, [{ text: 'Okay' }]);
      });
  };

  const getTrainerMeals = userID => {
    const index =
      trainerMeals.length !== 0
        ? trainerMeals.findIndex(obj => obj.trainer_id === userID)
        : -1;

    if (index !== -1) {
      return trainerMeals[index].meals;
    }

    return axios
      .get(`${BASE_URL}/meal/user/${userID}`, {
        headers: { Authorization: `Token ${userInfo.token}` },
      })
      .then(res => {
        const data = [...trainerMeals];
        data.push({ trainer_id: userID, meals: res.data });
        setTrainerMeals(data);
        return res.data;
      })
      .catch(e => {
        Alert.alert('Meals error!', `${e}`, [{ text: 'Okay' }]);
        return null;
      });
  };

  const getUserInfo = userID => {
    const stack = [...trainers];
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
        stack.splice(index, 1);
        setTrainers(stack);
        return null;
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
        Alert.alert('Follow error!', `${e}`, [{ text: 'Okay' }]);
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
        Alert.alert('Unfollow error!', `${e}`, [{ text: 'Okay' }]);
      });
  };

  return (
    <ClientContext.Provider
      value={
        userInfo.type === 'client'
          ? {
              meals,
              trainers,
              favTrainers,
              getUserInfo,
              getTrainers,
              followTrainer,
              unfollowTrainer,
              getTrainerMeals,
              getMeals,
              getMealInfo,
            }
          : null
      }
    >
      {children}
    </ClientContext.Provider>
  );
};
