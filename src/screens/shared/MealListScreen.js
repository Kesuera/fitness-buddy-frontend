import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { List, FAB, Button, IconButton, useTheme } from 'react-native-paper';
import { TrainerContext } from '../../context/TrainerContext';
import { AuthContext } from '../../context/AuthContext';
import { ClientContext } from '../../context/ClientContext';
import { ConnectionContext } from '../../context/ConnectionContext';

const MealListScreen = ({ navigation, route }) => {
  const { userInfo } = useContext(AuthContext);
  const { colors } = useTheme();
  const { deleteMeal } =
    userInfo.type === 'trainer' ? useContext(TrainerContext) : {};
  const { getTrainerMeals } =
    userInfo.type === 'client' ? useContext(ClientContext) : {};
  const { meals, getMeals } =
    userInfo.type === 'trainer'
      ? useContext(TrainerContext)
      : useContext(ClientContext);
  const [trainerMeals, setTrainerMeals] = useState([]);
  const { favTrainers } =
    userInfo.type === 'trainer' ? {} : useContext(ClientContext);
  const { connection } = useContext(ConnectionContext);

  useEffect(() => {
    const fetchData = async () => {
      if (route.params?.userID) {
        const data = await getTrainerMeals(route.params.userID);
        if (data) {
          setTrainerMeals(data);
        }
      } else {
        await getMeals();
      }
    };
    fetchData();
  }, [favTrainers, connection]);

  const handleDelete = mealInfo => {
    Alert.alert(`Deleting ${mealInfo.name}`, 'Are you sure?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      { text: 'YES', onPress: () => deleteMeal(mealInfo.id) },
    ]);
  };

  const item = mealInfo => {
    return (
      <View key={mealInfo.id} style={styles.itemContainer}>
        <Button
          icon="silverware-fork-knife"
          color={colors.backdrop}
          style={{
            width: userInfo.type === 'trainer' ? '80%' : '100%',
            alignItems: 'flex-start',
          }}
          uppercase={false}
          onPress={() => {
            navigation.navigate('Meal info', {
              mealID: mealInfo.id,
            });
          }}
        >
          {mealInfo.name}
        </Button>
        {userInfo.type === 'trainer' ? (
          <IconButton
            icon="delete"
            color={colors.error}
            style={styles.deleteButton}
            mode="outlined"
            onPress={() => {
              handleDelete(mealInfo);
            }}
          />
        ) : null}
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <List.Section style={styles.container}>
          <List.Accordion
            style={{ backgroundColor: colors.background }}
            title="Breakfast"
          >
            {route.params?.userID
              ? trainerMeals
                  .filter(meal => meal.type === 'breakfast')
                  .map(itemInfo => {
                    return item(itemInfo);
                  })
              : meals
                  .filter(meal => meal.type === 'breakfast')
                  .map(itemInfo => {
                    return item(itemInfo);
                  })}
          </List.Accordion>

          <List.Accordion
            style={{ backgroundColor: colors.background }}
            title="Lunch"
          >
            {route.params?.userID
              ? trainerMeals
                  .filter(meal => meal.type === 'lunch')
                  .map(itemInfo => {
                    return item(itemInfo);
                  })
              : meals
                  .filter(meal => meal.type === 'lunch')
                  .map(itemInfo => {
                    return item(itemInfo);
                  })}
          </List.Accordion>

          <List.Accordion
            style={{ backgroundColor: colors.background }}
            title="Dinner"
          >
            {route.params?.userID
              ? trainerMeals
                  .filter(meal => meal.type === 'dinner')
                  .map(itemInfo => {
                    return item(itemInfo);
                  })
              : meals
                  .filter(meal => meal.type === 'dinner')
                  .map(itemInfo => {
                    return item(itemInfo);
                  })}
          </List.Accordion>

          <List.Accordion
            style={{ backgroundColor: colors.background }}
            title="Deserts"
          >
            {route.params?.userID
              ? trainerMeals
                  .filter(meal => meal.type === 'desert')
                  .map(itemInfo => {
                    return item(itemInfo);
                  })
              : meals
                  .filter(meal => meal.type === 'desert')
                  .map(itemInfo => {
                    return item(itemInfo);
                  })}
          </List.Accordion>
        </List.Section>
      </ScrollView>
      {userInfo.type === 'trainer' ? (
        <FAB
          style={[styles.editButton, { backgroundColor: colors.primary }]}
          icon="plus"
          onPress={() => {
            navigation.navigate('Meal info', {
              mealID: null,
            });
          }}
        />
      ) : null}
    </View>
  );
};

export default MealListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // margin: 12,
  },
  editButton: {
    position: 'absolute',
    margin: 24,
    right: 0,
    bottom: 0,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 12,
  },
  deleteButton: { width: '20%' },
});
