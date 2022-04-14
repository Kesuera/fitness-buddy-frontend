import React, { useContext, useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Button, IconButton, useTheme, Searchbar } from 'react-native-paper';
import { ClientContext } from '../../context/ClientContext';

const FindATrainerScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { trainers, getTrainers, followTrainer, unfollowTrainer } =
    useContext(ClientContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [foundTrainers, setFoundTrainers] = useState([]);

  const onChangeSearch = query => {
    setSearchQuery(query);
    query = query.toLowerCase();
    if (query) {
      setFoundTrainers(
        trainers.filter(trainer => {
          return (
            trainer.username.toLowerCase().startsWith(query) ||
            trainer.full_name.toLowerCase().startsWith(query)
          );
        })
      );
    }
  };

  const handleFollow = trainerInfo => {
    if (trainerInfo.is_fav) {
      unfollowTrainer(trainerInfo.id);
    } else {
      followTrainer(trainerInfo.id);
    }
  };

  useEffect(() => {
    getTrainers();
  }, []);

  const item = trainerInfo => {
    return (
      <View key={trainerInfo.id} style={styles.itemContainer}>
        <Button
          icon="account-box"
          color={colors.backdrop}
          style={styles.userButton}
          uppercase={false}
          onPress={() => {
            navigation.navigate('Trainer profile', {
              userID: trainerInfo.id,
            });
          }}
        >
          {`${trainerInfo.full_name} (${trainerInfo.username})`}
        </Button>
        <IconButton
          icon={trainerInfo.is_fav ? 'heart' : 'heart-outline'}
          color={trainerInfo.is_fav ? colors.error : colors.backdrop}
          style={styles.followButton}
          mode="outlined"
          onPress={() => {
            handleFollow(trainerInfo);
          }}
        />
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Searchbar
        style={styles.searchBar}
        placeholder="Search trainers"
        onChangeText={onChangeSearch}
        value={searchQuery}
      />
      {searchQuery
        ? foundTrainers.map(trainerInfo => {
            return item(trainerInfo);
          })
        : trainers.map(trainerInfo => {
            return item(trainerInfo);
          })}
    </ScrollView>
  );
};

export default FindATrainerScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
  },
  searchBar: {
    marginBottom: 10,
    height: 40,
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
