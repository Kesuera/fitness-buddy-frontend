import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet, ScrollView, Keyboard, Alert } from 'react-native';
import {
    Text,
    Headline,
    Title,
    TextInput,
    FAB,
    Subheading,
    useTheme,
    Paragraph,
    Button,
    Avatar,
    Card,
  } from 'react-native-paper';
  import DropDown from 'react-native-paper-dropdown';
  import NumericInput from 'react-native-numeric-input';
  //import { launchImageLibrary } from 'react-native-image-picker';
  import { TrainerContext } from '../../context/TrainerContext';
  import { AuthContext } from '../../context/AuthContext';
  import Validator from '../../components/validation/Validator';
  import ValidationError from '../../components/validation/ValidationError';
  import { BASE_URL } from '../../config';
  import { ClientContext } from '../../context/ClientContext';

  EventInfoScreen = ({ route, navigation }) => {
    const { colors } = useTheme();
    const { eventID } = route.params; //??
    const { userInfo } = useContext(AuthContext);
    const { getEventInfo } =
    userInfo.type === 'trainer'
      ? useContext(TrainerContext)//?
      : useContext(ClientContext);//?
    const{ updateEvent, createEvent} = useContext(TrainerContext); //dorobit v trainer context
    const [eventInfo, setEventInfo] = useState({});
    const [isEditing, setIsEditing] = eventID ? useState(false) : useState(true);
    const [name, setName] = useState(''); //??
    const [isValidName, setIsValidName] = useState(true); //??
    const [isValidDate, setIsValidDate] = useState(true); //??
    const [isValidPlace, setIsValidPlace] = useState(true);
    
    const[place, setPlace] = useState('');
    const[date, setDate] = useState('');
    const[dateString, setDateString] = useState('');
    const[duration, setDuration] = useState('');


    const [price, setPrice] = useState('');
    const [description, setDescription] = useState(''); //??
    
    const [isValidDescription, setIsValidDescription] = useState(true); //??
    const [showDropDown, setShowDropDown] = useState(false); //??
    // const [mealTypeList, setMealTypeList] = useState([
    //     { label: 'Breakfast', value: 'breakfast' },
    //     { label: 'Lunch', value: 'lunch' },
    //     { label: 'Dinner', value: 'dinner' },
    //     { label: 'Desert', value: 'desert' },
    // ]); 
    const [keyboardOpen, setKeyboardOpen] = useState(false); //??

    
    useEffect(() => {
        const fetchData = async () => {
          const oneEvent = await getEventInfo(eventID);
          if (!oneEvent) {
            navigation.pop();
            Alert.alert('Error!', 'Event does not exist.', [{ text: 'Okay' }]);
            return;
          }
          setEventInfo(oneEvent);
          setName(oneEvent.name);
          setPlace(oneEvent.place);
          setDate(oneEvent.date);
          setDuration(oneEvent.duration);
          setPrice(oneEvent.price);
          setDescription(oneEvent.description);
        };
        if (eventID) fetchData();
    
        const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
          setKeyboardOpen(true);
        });
        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
          setKeyboardOpen(false);
        });
    
        return () => {
          showSubscription.remove();
          hideSubscription.remove();
        };
    }, []);
    
    
    //change atributes

    const handleUpdateCreateEvent = () => {
        if (name && place && date && description) {
          if (isValidName && isValidPlace && isValidDescription) {
            if (
              name != eventInfo.name ||
              place != eventInfo.place ||
              date != eventInfo.date ||
              duration != eventInfo.duration ||
              price != eventInfo.price ||
              description != eventInfo.description

            ) {
              const oneEvent = {
                id: eventID,
                name: name,
                place: place,
                date: date,
                duration: duration,
                price: price,
                description: description,
                //dateString : 
              };
              if (eventID) {
                updateEvent(oneEvent, eventID);
              } else {
                navigation.pop();
                createEvent(oneEvent);
              }
            }
    
            setIsEditing(!isEditing);
            return;
          }
        }
        Alert.alert('Wrong input!', 'Check if all fields are correct.', [
          { text: 'Okay' },
        ]);
      };

    const handleNameChange = text => {
        if ((text = Validator.validateMealAttribute(text))) {
        setName(text);
        setIsValidName(true);
        } else setIsValidName(false);
    };

    const handlePlaceChange = text => {
        if ((text = Validator.validateMealAttribute(text))) {
        setPlace(text);
        setIsValidPlace(true);
        } else setIsValidPlace(false);
    };

    const handleDateChange = text => {
        if((text = Validator.validateDateLength(text)) && (text = Validator.validateDateFormat(text))) {
            setDate(text)
            setIsValidDate(true);
        }
        else setIsValidDate(false);
    }

    const handleDescriptionChange = text => {
        if ((text = Validator.validateDescription(text))) {
          setDescription(text);
          setIsValidDescription(true);
        } else setIsValidDescription(false);
    };

    const handleEditCancel = () => {
        if (!eventID) {
          navigation.pop();
        }
    
        setName(eventInfo.name);
        setPlace(eventInfo.place);
        setDate(eventInfo.date);
        setDuration(eventInfo.duration);
        setPrice(eventInfo.price);
        setDescription(eventInfo.description);
        setIsEditing(!isEditing);
      };


    const eventHappeningDay = date.toString().slice(0,10);

    return(
        // <View style={styles.container}>
        //     <Text>{eventInfo.name}</Text>
        // </View>

        // <View style={{flex: 1}}>
        //     <ScrollView containerStyle={styles.container}>
        //         {/* { {!isEditing ?} } */}
        //         <View ScrollView>
        //             <View style={styles.eventHeaderContainer}>
        //                 <View style={styles.eventSubheadingContainer}>
        //                     <Headline style={{ color: colors.primary }}>
        //                         <Text>{eventInfo.name}</Text>
        //                     </Headline>
        //                     <Text>{eventInfo.description}</Text>
        //                 </View>

        //             </View>
        //         </View>
        //         {/* { {!isEditing ?} } */}
        // </ScrollView>
        // </View>



    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        {!isEditing ? (

            <View style={styles.eventHeaderContainer}>
              <View style={styles.eventSubheadingContainer}>
                <Headline style={{ color: colors.primary }}>
                  {eventInfo.name}
                </Headline>
                {/* <Text>{eventInfo.place}</Text> */}
              </View>

            </View>

        ) : null}
        {isEditing ? (
          <>
            <Subheading style={{ color: colors.primary }}>Name</Subheading>
            <TextInput
              mode="outlined"
              value={name}
              onSubmitEditing={Keyboard.dismiss}
              onChangeText={text => handleNameChange(text)}
            />
            {isValidName ? null : (
              <ValidationError
                errorMsg={'Name must be 4-100 characters long.'}
              />
            )}
            <View style={{ height: 10 }}></View>
          </>
        ) : null}
        <View style={{ height: 10 }}></View>



        <Subheading style={{ color: colors.primary }}>Place</Subheading>
        {isEditing ? (
          <>
            <TextInput
              mode="outlined"
              value={place}
              onSubmitEditing={Keyboard.dismiss}
              onChangeText={text => handlePlaceChange(text)}
            />
            {isValidPlace ? null : (
              <ValidationError
                errorMsg={'Place must be 4-100 characters long.'}
              />
            )}
          </>
        ) : (
          <Text style={{ textAlign: 'justify' }}>{eventInfo.place}</Text>
        )}

        <View style={{ height: 10 }}></View>

        <Subheading style={{ color: colors.primary }}>Date</Subheading>
        {isEditing ? (
          <>
            <TextInput
              mode="outlined"
              value={eventHappeningDay}
              onSubmitEditing={Keyboard.dismiss}
              onChangeText={text => handleDateChange(text)} //!
            />
            {isValidDate ? null : ( //!
              <ValidationError
                errorMsg={'Date must be long 10 symbols and in valid format RRRR-MM-DD.'}
              />
            )}

            {/* <Text style={{ textAlign: 'justify' }}>{eventHappeningDay}</Text> */}
          </>
        ) : (
          <Text style={{ textAlign: 'justify' }}>{eventHappeningDay}</Text>
        )}

        <View style={{ height: 10 }}></View>


        <Subheading style={{ color: colors.primary }}>
          Duration (min)
        </Subheading>
        {isEditing ? (
          <NumericInput
            onSubmitEditing={Keyboard.dismiss}
            type="plus-minus"
            value={duration}
            onChange={value => setDuration(Math.abs(value))} //!!!!!!!!!!!!!
            borderColor={colors.backdrop}
            minValue={0}
            maxValue={999}
            rounded
            containerStyle={{ marginTop: 5 }}
          />
        ) : (
          <Text style={{ textAlign: 'justify' }}>{eventInfo.duration}</Text>
        )}
        <View style={{ height: 10 }}></View>
        <Subheading style={{ color: colors.primary }}>Price (€)</Subheading>
        {isEditing ? (
          <NumericInput
            onSubmitEditing={Keyboard.dismiss}
            type="plus-minus"
            value={price}
            onChange={value => setPrice(Math.abs(value))}
            borderColor={colors.backdrop}
            minValue={0}
            maxValue={9999}
            rounded
            containerStyle={{ marginTop: 5 }}
          />
        ) : (
          <Text style={{ textAlign: 'justify' }}>{eventInfo.price}</Text>
        )}
        {!isEditing ? (
          <>
            <View style={{ height: 10 }}></View>
            <Subheading style={{ color: colors.primary }}>Trainer</Subheading>
            <Text
              style={{ textAlign: 'justify' }}
            >{`${eventInfo.trainer_full_name} (${eventInfo.trainer_username})`}</Text>
          </>
        ) : null}
        <View style={{ height: 10 }}></View>
        <Subheading style={{ color: colors.primary }}>Description</Subheading>
        {isEditing ? (
          <>
            <TextInput
              mode="outlined"
              value={description}
              onChangeText={text => handleDescriptionChange(text)}
              multiline
              onSubmitEditing={Keyboard.dismiss}
              style={{ height: 100 }}
            />
            {isValidDescription ? null : (
              <ValidationError
                errorMsg={'Description must be 10-500 characters long.'}
              />
            )}
            <View style={{ height: 100 }}></View>
          </>
        ) : (
          <Paragraph style={{ textAlign: 'justify' }}>
            {eventInfo.description}
          </Paragraph>
        )}
      </ScrollView>
      {isEditing && !keyboardOpen ? (
        <FAB
          style={[
            styles.editCancelButton,
            { backgroundColor: colors.background },
          ]}
          icon="close"
          onPress={() => handleEditCancel()}
        />
      ) : null}
      {!keyboardOpen && userInfo.type === 'trainer' ? (
        <FAB
          style={[styles.editButton, { backgroundColor: colors.primary }]}
          icon={isEditing ? 'check' : 'pencil'}
          onPress={() => {
            if (isEditing) handleUpdateCreateEvent();
            else setIsEditing(!isEditing);
          }}
        />
      ) : null}
    </View>









    );
}

export default EventInfoScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
  },

  eventHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  eventSubheadingContainer: {
    flex: 1,
    paddingHorizontal: 0,
    justifyContent: 'center',
  },
  editButton: {
    position: 'absolute',
    margin: 24,
    right: 0,
    bottom: 0,
  },
  editCancelButton: {
    position: 'absolute',
    marginVertical: 24,
    marginLeft: 24,
    marginRight: 100,
    right: 0,
    bottom: 0,
  },
});
