import React, { useContext, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import { TrainerContext } from '../../context/TrainerContext';

const FollowerListScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { followers, getFollowers } = useContext(TrainerContext);

  useEffect(() => {
    getFollowers();
  }, []);

  const item = followerInfo => {
    return (
      <View key={followerInfo.client_id} style={styles.itemContainer}>
        <Button
          icon="account-box"
          color={colors.backdrop}
          style={styles.userButton}
          uppercase={false}
          onPress={() =>
            navigation.navigate('Follower profile', {
              userID: followerInfo.client_id,
            })
          }
        >
          {`${followerInfo.client_full_name} (${followerInfo.client_username})`}
        </Button>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {followers.map(followerInfo => {
        return item(followerInfo);
      })}
    </ScrollView>
  );
};

export default FollowerListScreen;

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
    flex: 1,
    alignItems: 'flex-start',
    paddingVertical: 5,
  },
});
