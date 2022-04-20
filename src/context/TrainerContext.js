import React, { useState, createContext, useContext } from 'react';
import { Alert } from 'react-native';
import axios from 'axios';
import { BASE_URL } from '../config';
import { AuthContext } from './AuthContext';

export const TrainerContext = createContext();

export const TrainerProvider = ({ children }) => {
  const [followers, setFollowers] = useState([]);
  const [meals, setMeals] = useState([]);
  const [events, setAllEvents] = useState([]);
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

  const getAllEvents = userID => {
    axios
      .get(`${BASE_URL}/event/user/${userID ? userID : userInfo.id}`, {
        headers: { Authorization: `Token ${userInfo.token}` },
      })
      .then(res => {
        //console.log(res.data);
        let events = res.data;
        //console.log(events);
        setAllEvents(events);
      }
      )
      .catch(e => {
        Alert.alert(`Events error u trenera!`, `${e}`, [{ text: 'Okay' }]);
      });
  }

  const getEventInfo = eventID => {
    const stack = [...events];
    const index = stack.findIndex(oneEvent => oneEvent.id === eventID);

    if (index !== -1 && stack[index].trainer_username) {
      return stack[index];
    }

    return axios
      .get(`${BASE_URL}/event/${eventID}`, {
        headers: { Authorization: `Token ${userInfo.token}` },
      })
      .then(res => {
        stack[index] = res.data;
        setAllEvents(stack);
        return res.data;
      })
      .catch(e => {
        if (index !== -1) {
          stack.splice(index, 1);
          setAllEvents(stack);
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

  /**************************** */
  //

  const updateEvent = oneEvent => {
    const body = new FormData();

    body.append('name', oneEvent.name);
    body.append('place', oneEvent.place);
    body.append('date', oneEvent.date);
    body.append('duration', oneEvent.duration);
    body.append('price', oneEvent.price);
    body.append('description', oneEvent.description);


    fetch(`${BASE_URL}/event/update/${oneEvent.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Token ${userInfo.token}`,
        Accept: '*/*',

      },
      body: body,
    })
      .then(res => res.json())
      .then(res => {
        //console.log(res);
        const eventsCopy = [...events];
        const index = events.findIndex(ev => ev.id === oneEvent.id);

        eventsCopy[index].name = oneEvent.name;
        eventsCopy[index].place = oneEvent.place;
        eventsCopy[index].date = oneEvent.date;
        eventsCopy[index].duration = oneEvent.duration;
        eventsCopy[index].price = oneEvent.price;
        eventsCopy[index].description = oneEvent.description;

        setAllEvents(eventsCopy);
      })
      .catch(e => {
        Alert.alert('Update event error!tuto', `${e}`, [{ text: 'Okay' }]);
      });
  };

  const createEvent = oneEvent => {
    const body = new FormData();

    body.append('name', oneEvent.name);
    body.append('place', oneEvent.place);
    body.append('date', oneEvent.date);
    body.append('duration', oneEvent.duration);
    body.append('price', oneEvent.price);
    body.append('description', oneEvent.description);


    fetch(`${BASE_URL}/event/create`, {
      method: 'POST',
      headers: {
        Authorization: `Token ${userInfo.token}`,
        Accept: '*/*',

      },
      body: body,
    })
      .then(res => res.json())
      .then(res => {
        oneEvent.id = res.id;
        oneEvent.trainer_username = userInfo.username;
        oneEvent.trainer_full_name = userInfo.full_name;

        const eventsCopy = [...events];
        eventsCopy.push(oneEvent);
        setAllEvents(eventsCopy);
      })
      .catch(e => {
        Alert.alert('Create event error!', `${e}`, [{ text: 'Okay' }]);
      });
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

  const deleteEvent = eventID => {
    axios
      .delete(`${BASE_URL}/event/delete/${eventID}`, {
        headers: { Authorization: `Token ${userInfo.token}` },
      })
      .then(() => {
        const data = [...events];
        const index = events.findIndex(event => event.id === eventID);
        data.splice(index, 1);
        setAllEvents(data);
      })
      .catch(e => {
        Alert.alert('Delete event error!', `${e}`, [{ text: 'Okay' }]);
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
              events,
              getFollowers,
              getUserInfo,
              getMeals,
              updateEvent,
              createEvent,
              getAllEvents,
              deleteEvent,
              getMealInfo,
              getEventInfo,
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
