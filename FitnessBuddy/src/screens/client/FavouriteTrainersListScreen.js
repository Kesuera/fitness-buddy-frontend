import React, { useContext, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Button, IconButton, useTheme } from 'react-native-paper';
import { ClientContext } from '../../context/ClientContext';

const FavouriteTrainersListScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { favTrainers, getFavTrainers, unfollowTrainer } =
    useContext(ClientContext);

  useEffect(() => {
    getFavTrainers();
  }, []);

  const item = favTrainer => {
    return (
      <View key={favTrainer.trainer_id} style={styles.itemContainer}>
        <Button
          icon="account-box"
          color={colors.backdrop}
          style={styles.userButton}
          uppercase={false}
          onPress={() =>
            navigation.navigate('Trainer profile', {
              userID: favTrainer.trainer_id,
            })
          }
        >
          {`${favTrainer.trainer_full_name} (${favTrainer.trainer_username})`}
        </Button>
        <IconButton
          icon="heart"
          color={colors.error}
          style={styles.followButton}
          mode="outlined"
          onPress={() => {
            unfollowTrainer(favTrainer.trainer_id);
          }}
        />
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {favTrainers.map(favTrainer => {
        return item(favTrainer);
      })}
    </ScrollView>
  );
};

export default FavouriteTrainersListScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userButton: {
    width: '80%',
    alignItems: 'flex-start',
  },
  followButton: { flex: 1 },
});
