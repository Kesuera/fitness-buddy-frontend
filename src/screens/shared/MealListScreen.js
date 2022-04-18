import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { List, FAB, Button, IconButton, useTheme } from 'react-native-paper';
import { TrainerContext } from '../../context/TrainerContext';
import { AuthContext } from '../../context/AuthContext';
import { ClientContext } from '../../context/ClientContext';

const MealListScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { meals, getMeals, deleteMeal } = useContext(TrainerContext);
  const { userInfo } = useContext(AuthContext);
  const { followTrainer, unfollowTrainer } =
    userInfo.type === 'trainer' ? {} : useContext(ClientContext);

  useEffect(() => {
    const fetchData = async () => {
      await getMeals();
    };
    fetchData();
  }, [followTrainer, unfollowTrainer]);

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
            {meals
              .filter(meal => meal.type === 'breakfast')
              .map(itemInfo => {
                return item(itemInfo);
              })}
          </List.Accordion>

          <List.Accordion
            style={{ backgroundColor: colors.background }}
            title="Lunch"
          >
            {meals
              .filter(meal => meal.type === 'lunch')
              .map(itemInfo => {
                return item(itemInfo);
              })}
          </List.Accordion>

          <List.Accordion
            style={{ backgroundColor: colors.background }}
            title="Dinner"
          >
            {meals
              .filter(meal => meal.type === 'dinner')
              .map(itemInfo => {
                return item(itemInfo);
              })}
          </List.Accordion>

          <List.Accordion
            style={{ backgroundColor: colors.background }}
            title="Deserts"
          >
            {meals
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
