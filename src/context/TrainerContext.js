import React, { useState, createContext, useContext, useEffect } from 'react';
import { Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../config';
import { AuthContext } from './AuthContext';
import { ConnectionContext } from './ConnectionContext';

export const TrainerContext = createContext();

export const TrainerProvider = ({ children }) => {
  const [followers, setFollowers] = useState([]);
  const [meals, setMeals] = useState([]);
  const { userInfo, logout } = useContext(AuthContext);
  const { connection } = useContext(ConnectionContext);
  const [unknownIndex, setUnknownIndex] = useState(-1);

  useEffect(async () => {
    const dataToSync = JSON.parse(await AsyncStorage.getItem('dataToSync'));
    if (dataToSync) {
      dataToSync.forEach(change => {
        switch (change.method) {
          case 'deleteMeal':
            deleteMeal(...change.params, true);
            break;
          case 'updateMeal':
            updateMeal(...change.params, true);
            break;
          case 'createMeal':
            createMeal(...change.params, true);
            break;
          default:
            break;
        }
      });
      await AsyncStorage.removeItem('dataToSync');
    }
  }, [connection]);

  const getFollowers = async () => {
    if (!connection) {
      const followers = JSON.parse(await AsyncStorage.getItem('followers'));
      if (followers) {
        setFollowers(followers);
      }
      return;
    }

    axios
      .get(`${BASE_URL}/user/favourites`, {
        headers: { Authorization: `Token ${userInfo.token}` },
      })
      .then(res => {
        setFollowers(res.data);
        AsyncStorage.setItem('followers', JSON.stringify(res.data));
      })
      .catch(e => {
        if (e.response.status === 401) {
          logout();
          return;
        }
        Alert.alert('Followers error!', `${e}`, [{ text: 'Okay' }]);
      });
  };

  const getMeals = async userID => {
    if (!connection) {
      const meals = JSON.parse(await AsyncStorage.getItem('meals'));
      if (meals) {
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

  const getMealInfo = async mealID => {
    const stack = connection
      ? [...meals]
      : JSON.parse(await AsyncStorage.getItem('meals'));
    const index = stack ? stack.findIndex(meal => meal.id === mealID) : -1;

    if (index !== -1 && stack[index].trainer_username) {
      return stack[index];
    }

    if (!connection) {
      return null;
    }

    return axios
      .get(`${BASE_URL}/meal/${mealID}`, {
        headers: { Authorization: `Token ${userInfo.token}` },
      })
      .then(res => {
        stack[index] = res.data;
        setMeals(stack);
        AsyncStorage.setItem('meals', JSON.stringify(stack));
        return res.data;
      })
      .catch(e => {
        if (e.response.status === 401) {
          logout();
          return;
        }
        if (e.response.status === 404) {
          if (index !== -1) {
            stack.splice(index, 1);
            setMeals(stack);
            AsyncStorage.setItem('meals', JSON.stringify(stack));
          }
          return null;
        }
        Alert.alert('Meal error!', `${e}`, [{ text: 'Okay' }]);
        return null;
      });
  };

  const getMealPhoto = async name => {
    if (!connection) {
      return null;
    }

    try {
      const res = await axios.get(`${BASE_URL}/meal/image${name}`, {
        headers: {
          Accept: '*/*',
          Authorization: `Token ${userInfo.token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data;
    } catch (e) {
      if (e.response.status === 401) {
        logout();
        return null;
      }
      return null;
    }
  };

  const updateMeal = async (meal, sync = false) => {
    if (!connection) {
      const mealsCopy = [...meals];
      const index = meals.findIndex(m => m.id === meal.id);
      mealsCopy[index].type = meal.type;
      mealsCopy[index].description = meal.description;
      mealsCopy[index].name = meal.name;
      mealsCopy[index].ingredients = meal.ingredients;
      mealsCopy[index].prep_time = meal.prep_time;
      mealsCopy[index].calories = meal.calories;
      mealsCopy[index].photo_path = meal.photo_path;
      setMeals(mealsCopy);
      AsyncStorage.setItem('meals', JSON.stringify(mealsCopy));

      let dataToSync = JSON.parse(await AsyncStorage.getItem('dataToSync'));
      if (dataToSync) {
        dataToSync.push({
          method: 'updateMeal',
          params: [meal],
        });
      } else {
        dataToSync = [
          {
            method: 'updateMeal',
            params: [meal],
          },
        ];
      }
      AsyncStorage.setItem('dataToSync', JSON.stringify(dataToSync));
      return;
    }

    const body = new FormData();
    body.append('type', meal.type);
    body.append('name', meal.name);
    body.append('ingredients', meal.ingredients);
    body.append('prep_time', meal.prep_time);
    body.append('calories', meal.calories);
    body.append('description', meal.description);
    if (meal.photo_path) body.append('photo_path', meal.photo_path);

    fetch(`${BASE_URL}/meal/update/${meal.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Token ${userInfo.token}`,
        Accept: '*/*',
        'Content-Type': 'multipart/form-data',
      },
      body: body,
    })
      .then(res => res.json())
      .then(res => {
        if (!sync) {
          const mealsCopy = [...meals];
          const index = meals.findIndex(m => m.id === meal.id);
          mealsCopy[index].type = meal.type;
          mealsCopy[index].description = meal.description;
          mealsCopy[index].name = meal.name;
          mealsCopy[index].ingredients = meal.ingredients;
          mealsCopy[index].prep_time = meal.prep_time;
          mealsCopy[index].calories = meal.calories;
          mealsCopy[index].photo_path = res.photo_path;
          setMeals(mealsCopy);
          AsyncStorage.setItem('meals', JSON.stringify(mealsCopy));
        }
      })
      .catch(e => {
        if (e.response.status === 401) {
          logout();
          return;
        }
        Alert.alert('Update meal error!', `${e}`, [{ text: 'Okay' }]);
      });
  };

  const createMeal = async (meal, sync = false) => {
    if (!connection) {
      meal.id = unknownIndex;
      meal.trainer_username = userInfo.username;
      meal.trainer_full_name = userInfo.full_name;
      const mealsCopy = [...meals];
      mealsCopy.push(meal);
      setMeals(mealsCopy);
      setUnknownIndex(unknownIndex - 1);
      AsyncStorage.setItem('meals', JSON.stringify(mealsCopy));

      let dataToSync = JSON.parse(await AsyncStorage.getItem('dataToSync'));
      if (dataToSync) {
        dataToSync.push({
          method: 'createMeal',
          params: [meal],
        });
      } else {
        dataToSync = [
          {
            method: 'createMeal',
            params: [meal],
          },
        ];
      }
      AsyncStorage.setItem('dataToSync', JSON.stringify(dataToSync));
      return;
    }

    const body = new FormData();
    body.append('type', meal.type);
    body.append('name', meal.name);
    body.append('ingredients', meal.ingredients);
    body.append('prep_time', meal.prep_time);
    body.append('calories', meal.calories);
    body.append('description', meal.description);

    if (meal.photo_path) body.append('photo_path', meal.photo_path);

    fetch(`${BASE_URL}/meal/create`, {
      method: 'POST',
      headers: {
        Authorization: `Token ${userInfo.token}`,
        Accept: '*/*',
        'Content-Type': 'multipart/form-data',
      },
      body: body,
    })
      .then(res => res.json())
      .then(res => {
        if (!sync) {
          meal.id = res.id;
          meal.trainer_username = userInfo.username;
          meal.trainer_full_name = userInfo.full_name;
          meal.photo_path = res.photo_path;
          const mealsCopy = [...meals];
          mealsCopy.push(meal);
          setMeals(mealsCopy);
          AsyncStorage.setItem('meals', JSON.stringify(mealsCopy));
        } else {
          const index = meals.findIndex(meal => meal.id < 0);
          const mealsCopy = [...meals];
          mealsCopy[index].id = res.id;
          mealsCopy[index].photo_path = res.photo_path;
          setMeals(mealsCopy);
          AsyncStorage.setItem('meals', JSON.stringify(mealsCopy));
        }
      })
      .catch(e => {
        if (e.response.status === 401) {
          logout();
          return;
        }
        Alert.alert('Create meal error!', `${e}`, [{ text: 'Okay' }]);
      });
  };

  const deleteMeal = async (mealID, sync = false) => {
    if (!connection) {
      const data = [...meals];
      const index = meals.findIndex(meal => meal.id === mealID);
      data.splice(index, 1);
      setMeals(data);
      AsyncStorage.setItem('meals', JSON.stringify(data));
      let dataToSync = JSON.parse(await AsyncStorage.getItem('dataToSync'));
      if (dataToSync) {
        dataToSync.push({
          method: 'deleteMeal',
          params: [mealID],
        });
      } else {
        dataToSync = [
          {
            method: 'deleteMeal',
            params: [mealID],
          },
        ];
      }
      AsyncStorage.setItem('dataToSync', JSON.stringify(dataToSync));
      return;
    }

    axios
      .delete(`${BASE_URL}/meal/delete/${mealID}`, {
        headers: { Authorization: `Token ${userInfo.token}` },
      })
      .then(() => {
        if (!sync) {
          const data = [...meals];
          const index = meals.findIndex(meal => meal.id === mealID);
          data.splice(index, 1);
          setMeals(data);
          AsyncStorage.setItem('meals', JSON.stringify(data));
        }
      })
      .catch(e => {
        if (e.response.status === 401) {
          logout();
          return;
        }
        Alert.alert('Delete error!', `${e}`, [{ text: 'Okay' }]);
      });
  };

  const getUserInfo = async userID => {
    const stack = connection
      ? [...followers]
      : JSON.parse(await AsyncStorage.getItem('followers'));
    const index = stack
      ? stack.findIndex(follower => follower.client_id === userID)
      : -1;

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
        setFollowers(stack);
        AsyncStorage.setItem('followers', JSON.stringify(stack));
        return data;
      })
      .catch(e => {
        if (e.response.status === 401) {
          logout();
          return;
        }
        if (e.response.status === 404) {
          stack.splice(index, 1);
          setFollowers(stack);
          AsyncStorage.setItem('followers', JSON.stringify(stack));
          return null;
        }
        Alert.alert('User error!', `${e}`, [{ text: 'Okay' }]);
        return null;
      });
  };

  return (
    <TrainerContext.Provider
      value={
        userInfo.type == 'trainer'
          ? {
              followers,
              meals,
              getFollowers,
              getUserInfo,
              getMeals,
              getMealInfo,
              getMealPhoto,
              updateMeal,
              createMeal,
              deleteMeal,
            }
          : { getMealPhoto }
      }
    >
      {children}
    </TrainerContext.Provider>
  );
};
