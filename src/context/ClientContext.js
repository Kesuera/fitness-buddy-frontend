import React, { useState, createContext, useContext, useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '../config';
import { AuthContext } from './AuthContext';
import { ConnectionContext } from './ConnectionContext';

export const ClientContext = createContext();

export const ClientProvider = ({ children }) => {
  const [trainers, setTrainers] = useState([]);
  const [favTrainers, setFavTrainers] = useState([]);
  const [meals, setMeals] = useState([]);
  const [trainerMeals, setTrainerMeals] = useState([]);
  const { userInfo, logout } = useContext(AuthContext);
  const { connection } = useContext(ConnectionContext);

  useEffect(async () => {
    const dataToSync = JSON.parse(await AsyncStorage.getItem('dataToSync'));
    if (dataToSync) {
      dataToSync.forEach(change => {
        switch (change.method) {
          case 'followTrainer':
            followTrainer(...change.params, true);
            break;
          case 'unfollowTrainer':
            unfollowTrainer(...change.params, true);
            break;
          default:
            break;
        }
      });
      await AsyncStorage.removeItem('dataToSync');
    }
  }, [connection]);

  const getMealInfo = async mealID => {
    const stackMeals = connection
      ? [...meals]
      : JSON.parse(await AsyncStorage.getItem('meals'));
    const stackTrainerMeals = connection
      ? [...trainerMeals]
      : JSON.parse(await AsyncStorage.getItem('trainerMeals'));

    const indexMeals = stackMeals
      ? stackMeals.findIndex(meal => meal.id === mealID)
      : -1;
    const indexTrainerMeals = stackTrainerMeals
      ? stackTrainerMeals.findIndex(
          obj => obj.meals.findIndex(meal => meal.id === mealID) !== -1
        )
      : -1;
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

    if (!connection) {
      return null;
    }

    return axios
      .get(`${BASE_URL}/meal/${mealID}`, {
        headers: { Authorization: `Token ${userInfo.token}` },
      })
      .then(res => {
        stackMeals[indexMeals] = res.data;
        setMeals(stackMeals);
        AsyncStorage.setItem('meals', JSON.stringify(stackMeals));

        if (indexInTrainerMeals !== -1) {
          stackTrainerMeals[indexTrainerMeals].meals[indexInTrainerMeals] =
            res.data;
          setTrainerMeals(stackTrainerMeals);
          AsyncStorage.setItem(
            'trainerMeals',
            JSON.stringify(stackTrainerMeals)
          );
        }

        return res.data;
      })
      .catch(e => {
        if (e.response.status === 401) {
          logout();
          return;
        }
        if (e.response.status === 404) {
          if (indexMeals !== -1) {
            stackMeals.splice(indexMeals, 1);
            setMeals(stackMeals);
            AsyncStorage.setItem('meals', JSON.stringify(stackMeals));
          }
          if (indexInTrainerMeals !== -1) {
            stackTrainerMeals[indexTrainerMeals].meals.splice(
              indexInTrainerMeals,
              1
            );
            setTrainerMeals(stackTrainerMeals);
            AsyncStorage.setItem(
              'trainerMeals',
              JSON.stringify(stackTrainerMeals)
            );
          }
          return null;
        }
        Alert.alert('Meal error!', `${e}`, [{ text: 'Okay' }]);
        return null;
      });
  };

  const getMeals = async userID => {
    if (!connection) {
      const meals = JSON.parse(await AsyncStorage.getItem('meals'));
      if (meals && meals.length !== 0) {
        setMeals(meals);
      } else {
        const meals = [];
        const trainerMeals = JSON.parse(
          await AsyncStorage.getItem('trainerMeals')
        );
        if (trainerMeals && trainerMeals.length !== 0) {
          trainerMeals.forEach(obj => {
            obj.meals.forEach(meal => meals.push(meal));
          });
        }
        setMeals(meals);
      }
      return;
    }

    axios
      .get(`${BASE_URL}/meal/user/${userID ? userID : userInfo.id}`, {
        headers: { Authorization: `Token ${userInfo.token}` },
      })
      .then(res => {
        setMeals(res.data);
        AsyncStorage.setItem('meals', JSON.stringify(res.data));
      })
      .catch(e => {
        if (e.response.status === 401) {
          logout();
          return;
        }
        Alert.alert('Meals error!', `${e}`, [{ text: 'Okay' }]);
      });
  };

  const getTrainers = async () => {
    if (!connection) {
      const trainers = JSON.parse(await AsyncStorage.getItem('trainers'));
      if (trainers) {
        const favTrainers = trainers.filter(trainer => trainer.is_fav);
        setTrainers(trainers);
        setFavTrainers(favTrainers);
      }
      return;
    }

    axios
      .get(`${BASE_URL}/user/trainer`, {
        headers: { Authorization: `Token ${userInfo.token}` },
      })
      .then(res => {
        const trainers = res.data;
        const favTrainers = trainers.filter(trainer => trainer.is_fav);
        setTrainers(trainers);
        setFavTrainers(favTrainers);
        AsyncStorage.setItem('trainers', JSON.stringify(trainers));
        AsyncStorage.setItem('favTrainers', JSON.stringify(favTrainers));
      })
      .catch(e => {
        if (e.response.status === 401) {
          logout();
          return;
        }
        Alert.alert('Trainers error!', `${e}`, [{ text: 'Okay' }]);
      });
  };

  const getTrainerMeals = async userID => {
    const data = connection
      ? trainerMeals
      : JSON.parse(await AsyncStorage.getItem('trainerMeals'));

    const index =
      data && data.length !== 0
        ? data.findIndex(obj => obj.trainer_id === userID)
        : -1;

    if (index !== -1) {
      return data[index].meals;
    }

    if (!connection) {
      return null;
    }

    return axios
      .get(`${BASE_URL}/meal/user/${userID}`, {
        headers: { Authorization: `Token ${userInfo.token}` },
      })
      .then(res => {
        const data = [...trainerMeals];
        data.push({ trainer_id: userID, meals: res.data });
        setTrainerMeals(data);
        AsyncStorage.setItem('trainerMeals', JSON.stringify(data));
        return res.data;
      })
      .catch(e => {
        if (e.response.status === 401) {
          logout();
          return;
        }
        Alert.alert('Meals error!', `${e}`, [{ text: 'Okay' }]);
        return null;
      });
  };

  const getUserInfo = async userID => {
    const stack = connection
      ? [...trainers]
      : JSON.parse(await AsyncStorage.getItem('trainers'));
    const index = stack
      ? stack.findIndex(trainer => trainer.id === userID)
      : -1;

    if (index !== -1 && stack[index].type) {
      return stack[index];
    }

    if (!connection) {
      return null;
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
        AsyncStorage.setItem('trainers', JSON.stringify(stack));
        return data;
      })
      .catch(e => {
        if (e.response.status === 401) {
          logout();
          return;
        }
        if (e.response.status === 404) {
          stack.splice(index, 1);
          setTrainers(stack);
          AsyncStorage.setItem('trainers', JSON.stringify(stack));
          return null;
        }
        Alert.alert('User error!', `${e}`, [{ text: 'Okay' }]);
        return null;
      });
  };

  const followTrainer = async (trainer_id, sync = false) => {
    const strcmp = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

    if (!connection) {
      const index = trainers.findIndex(trainer => trainer.id === trainer_id);
      const favIndex =
        favTrainers.length !== 0
          ? favTrainers.findIndex(trainer => trainer.trainer_id === trainer_id)
          : -1;
      if (favIndex === -1) {
        const favTrainersCopy = [...favTrainers];
        const trainer = trainers[index];
        favTrainersCopy.push(trainer);
        favTrainersCopy.sort((a, b) => strcmp(a.full_name, b.full_name));
        setFavTrainers(favTrainersCopy);
        AsyncStorage.setItem('favTrainers', JSON.stringify(favTrainersCopy));
      }

      const trainersCopy = [...trainers];
      trainersCopy[index].is_fav = true;
      setTrainers(trainersCopy);
      AsyncStorage.setItem('trainers', JSON.stringify(trainersCopy));

      let dataToSync = JSON.parse(await AsyncStorage.getItem('dataToSync'));
      if (dataToSync) {
        dataToSync.push({
          method: 'followTrainer',
          params: [trainer_id],
        });
      } else {
        dataToSync = [
          {
            method: 'followTrainer',
            params: [trainer_id],
          },
        ];
      }
      AsyncStorage.setItem('dataToSync', JSON.stringify(dataToSync));
      return;
    }

    axios
      .post(
        `${BASE_URL}/user/favourites/follow/${trainer_id}`,
        {},
        {
          headers: { Authorization: `Token ${userInfo.token}` },
        }
      )
      .then(() => {
        if (!sync) {
          const index = trainers.findIndex(
            trainer => trainer.id === trainer_id
          );
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
            AsyncStorage.setItem(
              'favTrainers',
              JSON.stringify(favTrainersCopy)
            );
          }

          const trainersCopy = [...trainers];
          trainersCopy[index].is_fav = true;
          setTrainers(trainersCopy);
          AsyncStorage.setItem('trainers', JSON.stringify(trainersCopy));
        }
      })
      .catch(e => {
        if (e.response.status === 401) {
          logout();
          return;
        }
        Alert.alert('Follow error!', `${e}`, [{ text: 'Okay' }]);
      });
  };

  const unfollowTrainer = async (trainer_id, sync = false) => {
    if (!connection) {
      if (favTrainers.length !== 0) {
        const data = [...favTrainers];
        const index = favTrainers.findIndex(
          trainer => trainer.id === trainer_id
        );
        data.splice(index, 1);
        setFavTrainers(data);
        AsyncStorage.setItem('favTrainers', JSON.stringify(data));
      }

      if (trainers.length !== 0) {
        const data = [...trainers];
        const index = trainers.findIndex(trainer => trainer.id === trainer_id);
        data[index].is_fav = false;
        setTrainers(data);
        AsyncStorage.setItem('trainers', JSON.stringify(data));
      }

      let dataToSync = JSON.parse(await AsyncStorage.getItem('dataToSync'));
      if (dataToSync) {
        dataToSync.push({
          method: 'unfollowTrainer',
          params: [trainer_id],
        });
      } else {
        dataToSync = [
          {
            method: 'unfollowTrainer',
            params: [trainer_id],
          },
        ];
      }
      AsyncStorage.setItem('dataToSync', JSON.stringify(dataToSync));
      return;
    }

    axios
      .delete(`${BASE_URL}/user/favourites/unfollow/${trainer_id}`, {
        headers: { Authorization: `Token ${userInfo.token}` },
      })
      .then(() => {
        if (!sync) {
          if (favTrainers.length !== 0) {
            const data = [...favTrainers];
            const index = favTrainers.findIndex(
              trainer => trainer.id === trainer_id
            );
            data.splice(index, 1);
            setFavTrainers(data);
            AsyncStorage.setItem('favTrainers', JSON.stringify(data));
          }

          if (trainers.length !== 0) {
            const data = [...trainers];
            const index = trainers.findIndex(
              trainer => trainer.id === trainer_id
            );
            data[index].is_fav = false;
            setTrainers(data);
            AsyncStorage.setItem('trainers', JSON.stringify(data));
          }
        }
      })
      .catch(e => {
        if (e.response.status === 401) {
          logout();
          return;
        }
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
