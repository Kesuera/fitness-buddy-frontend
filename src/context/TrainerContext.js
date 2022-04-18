import React, { useState, createContext, useContext } from 'react';
import { Alert } from 'react-native';
import axios from 'axios';
import { BASE_URL } from '../config';
import { AuthContext } from './AuthContext';

export const TrainerContext = createContext();

export const TrainerProvider = ({ children }) => {
  const [followers, setFollowers] = useState([]);
  const [meals, setMeals] = useState([]);
  const { userInfo } = useContext(AuthContext);

  const getFollowers = () => {
    axios
      .get(`${BASE_URL}/user/favourites`, {
        headers: { Authorization: `Token ${userInfo.token}` },
      })
      .then(res => {
        setFollowers(res.data);
      })
      .catch(e => {
        Alert.alert('Followers error!', `${e}`, [{ text: 'Okay' }]);
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

  const getMealInfo = mealID => {
    const stack = [...meals];
    const index = stack.findIndex(meal => meal.id === mealID);

    if (index !== -1 && stack[index].trainer_username) {
      return stack[index];
    }

    return axios
      .get(`${BASE_URL}/meal/${mealID}`, {
        headers: { Authorization: `Token ${userInfo.token}` },
      })
      .then(res => {
        stack[index] = res.data;
        setMeals(stack);
        return res.data;
      })
      .catch(e => {
        if (index !== -1) {
          stack.splice(index, 1);
          setMeals(stack);
        }
        return null;
      });
  };

  const getMealPhoto = async name => {
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
      return null;
    }
  };

  const updateMeal = meal => {
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
      })
      .catch(e => {
        Alert.alert('Update meal error!', `${e}`, [{ text: 'Okay' }]);
      });
  };

  const createMeal = meal => {
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
        meal.id = res.id;
        meal.trainer_username = userInfo.username;
        meal.trainer_full_name = userInfo.full_name;
        meal.photo_path = res.photo_path;
        const mealsCopy = [...meals];
        mealsCopy.push(meal);
        setMeals(mealsCopy);
      })
      .catch(e => {
        Alert.alert('Create meal error!', `${e}`, [{ text: 'Okay' }]);
      });
  };

  const deleteMeal = mealID => {
    axios
      .delete(`${BASE_URL}/meal/delete/${mealID}`, {
        headers: { Authorization: `Token ${userInfo.token}` },
      })
      .then(() => {
        const data = [...meals];
        const index = meals.findIndex(meal => meal.id === mealID);
        data.splice(index, 1);
        setMeals(data);
      })
      .catch(e => {
        Alert.alert('Delete error!', `${e}`, [{ text: 'Okay' }]);
      });
  };

  const getUserInfo = userID => {
    const stack = [...followers];
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
        stack.splice(index, 1);
        setFollowers(stack);
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
