import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Searchbar, FAB , useTheme, Button, IconButton } from 'react-native-paper';
import { TrainerContext } from '../../context/TrainerContext';
import { AuthContext } from '../../context/AuthContext';
import { ClientContext } from '../../context/ClientContext';

const EventListScreen = ({ navigation, route }) => {
  //console.log(route);
  

  //console.log("here it fu*** up")
  const { colors } = useTheme();
  const { userInfo } = useContext(AuthContext);
  const { deleteEvent } = userInfo.type === 'trainer' ? useContext(TrainerContext) : {};
  const { getTrainerEvents } =
  userInfo.type === 'client' ? useContext(ClientContext) : {};


  const { events, getAllEvents } = userInfo.type === 'client' 
  ? useContext(ClientContext) : useContext(TrainerContext);

  const [trainerEvents, setTrainerEvents] = useState([]); //??tr

  const { favTrainers } = userInfo.type === 'client' ? useContext(ClientContext) : {};
  //const [eventQuery, setEventQuery] = useState('');
  //const [foundEvents, setFoundEvents] = useState([]);


  // const changeSearch = query => {
  //   setEventQuery(query);
  //   query = query.toLowerCase();
  //   if (query){
  //     setFoundEvents(
  //       foundevents.filter(oneEvent => {
  //         return (oneEvent.name.toLowerCase().startsWith(query));
  //       })
  //     );

  //   }
  // };


  useEffect(() => {
    const fetchData = async () => {
      if (route.params?.userID) {
        const data = await getTrainerEvents(route.params.userID);
        setTrainerEvents(data);
      } else {
        await getAllEvents();
      }
    };
    fetchData();
    
    },[favTrainers]);

  const handleEventDelete = eventInfo => {
    Alert.alert(`Deleting ${eventInfo.name}`, 'Are you sure?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      { text: 'YES', onPress: () => deleteEvent(eventInfo.id) },
    ]);
  };


  

  const specEvent = eventInfo => {
    return (
      <View key={eventInfo.id} style={styles.itemContainer}>
        
        <Button
          icon='rowing'
          color={colors.backdrop}
          style={
            {
            width: userInfo.type === 'trainer' ? '80%' : '100%',
            alignItems: 'flex-start',
            }}
          uppercase={false}

          onPress={() => {
            navigation.navigate('Event info', {
            eventID: eventInfo.id,
            });
          }}
        >
          {`${eventInfo.name}`}
        </Button>
        {userInfo.type === 'trainer' ? (
          <IconButton
            icon='delete'
            color={colors.backdrop}
            style={styles.deleteButton} 
            mode='outlined'
            onPress={() => {
              handleEventDelete(eventInfo);
            }}
            />
        ) : null}
      </View>
      );
  };


  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        {/* <Searchbar
        style={styles.searchbar}
        placeholder="Search for an event"
        onChangeText={changeSearch}
        value={eventQuery}
        /> */}

        
        {events.map(eventInfo => {return specEvent(eventInfo);})}

      </ScrollView>
      {userInfo.type === 'trainer' ? (
        <FAB
          style={[styles.editButton, { backgroundColor: colors.primary }]}
          icon="plus"
          onPress={() => {
            navigation.navigate('Event info', {
              eventID: null,
            });
          }}
        />
      ) : null}
      {/* <View style={styles.containerChild}></View> */}
    </View>
    
  );
};


export default EventListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
  },
  editButton: {
    position: 'absolute',
    marginRight: 40,
    marginBottom: 40,
    right: 0,
    bottom: 0,
  },
  // containerChild:{
  //   flex: 0.05,
  // },
  // searchbar: {
  //   marginTop: 10,
  //   height: 40,
  // },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userButton: {
    width: '80%',
    alignItems: 'flex-start',
  },
  deleteButton: { width: '20%' },
});
