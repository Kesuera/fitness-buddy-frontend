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
import { launchImageLibrary } from 'react-native-image-picker';
import { TrainerContext } from '../../context/TrainerContext';
import { AuthContext } from '../../context/AuthContext';
import Validator from '../../components/validation/Validator';
import ValidationError from '../../components/validation/ValidationError';
import { BASE_URL } from '../../config';
import { ClientContext } from '../../context/ClientContext';

const MealInfoScreen = ({ route, navigation }) => {
  const { colors } = useTheme();
  const { mealID } = route.params;
  const { userInfo } = useContext(AuthContext);
  const { getMealInfo } =
    userInfo.type === 'trainer'
      ? useContext(TrainerContext)
      : useContext(ClientContext);
  const { updateMeal, createMeal } = useContext(TrainerContext);
  const [mealInfo, setMealInfo] = useState({});
  const [isEditing, setIsEditing] = mealID ? useState(false) : useState(true);
  const [name, setName] = useState('');
  const [isValidName, setIsValidName] = useState(true);
  const [type, setType] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [isValidIngredients, setIsValidIngredients] = useState(true);
  const [prepTime, setPrepTime] = useState(0);
  const [calories, setCalories] = useState(0);
  const [description, setDescription] = useState('');
  const [isValidDescription, setIsValidDescription] = useState(true);
  const [showDropDown, setShowDropDown] = useState(false);
  const [mealTypeList, setMealTypeList] = useState([
    { label: 'Breakfast', value: 'breakfast' },
    { label: 'Lunch', value: 'lunch' },
    { label: 'Dinner', value: 'dinner' },
    { label: 'Desert', value: 'desert' },
  ]);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const meal = await getMealInfo(mealID);
      if (!meal) {
        navigation.pop();
        Alert.alert('Error!', 'Meal does not exist.', [{ text: 'Okay' }]);
        return;
      }
      setMealInfo(meal);
      setName(meal.name);
      setType(meal.type);
      setIngredients(meal.ingredients);
      setPrepTime(meal.prep_time);
      setCalories(meal.calories);
      setDescription(meal.description);
    };
    if (mealID) fetchData();

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

  const handleChooseImage = () => {
    launchImageLibrary({ noData: true }, res => {
      if (res.didCancel) return;
      const data = res.assets[0];
      if (data) {
        setPhoto({
          uri: data.uri,
          name: data.fileName,
          type: data.type,
        });
      }
    });
  };

  const handleUpdateCreateMeal = () => {
    if (name && type && ingredients && description) {
      if (isValidName && isValidIngredients && isValidDescription && type) {
        if (
          name != mealInfo.name ||
          type != mealInfo.type ||
          ingredients != mealInfo.ingredients ||
          prepTime != mealInfo.prep_time ||
          calories != mealInfo.calories ||
          description != mealInfo.description ||
          photo
        ) {
          const meal = {
            id: mealID,
            name: name,
            type: type,
            ingredients: ingredients,
            prep_time: prepTime,
            calories: calories,
            description: description,
            photo_path: photo ? photo : null,
          };
          if (mealID) {
            updateMeal(meal, mealID);
          } else {
            navigation.pop();
            createMeal(meal);
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

  const handleIngredientsChange = text => {
    if ((text = Validator.validateMealAttribute(text))) {
      setIngredients(text);
      setIsValidIngredients(true);
    } else setIsValidIngredients(false);
  };

  const handleDescriptionChange = text => {
    if ((text = Validator.validateDescription(text))) {
      setDescription(text);
      setIsValidDescription(true);
    } else setIsValidDescription(false);
  };

  const handleEditCancel = () => {
    if (!mealID) {
      navigation.pop();
    }

    setName(mealInfo.name);
    setType(mealInfo.type);
    setIngredients(mealInfo.ingredients);
    setPrepTime(mealInfo.prep_time);
    setCalories(mealInfo.calories);
    setDescription(mealInfo.description);
    setIsEditing(!isEditing);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        {!isEditing ? (
          <View style={styles.headerContainer}>
            <View style={styles.mealHeaderContainer}>
              <View style={styles.mealSubheadingContainer}>
                <Headline style={{ color: colors.primary }}>
                  {mealInfo.name}
                </Headline>
                <Text>{mealInfo.type}</Text>
              </View>
              {mealInfo.photo_path ? (
                <Avatar.Image
                  size={175}
                  source={{
                    uri: `${BASE_URL}/meal/image${mealInfo.photo_path}`,
                    method: 'GET',
                    headers: {
                      Authorization: `Token ${userInfo.token}`,
                    },
                  }}
                />
              ) : (
                <Avatar.Icon
                  size={175}
                  backgroundColor={colors.backdrop}
                  icon="silverware-fork-knife"
                />
              )}
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

        {isEditing ? (
          <>
            <Subheading style={{ color: colors.primary }}>Image</Subheading>
            {photo ? (
              <>
                <Avatar.Image
                  size={175}
                  source={{
                    uri: photo.uri,
                  }}
                />
              </>
            ) : null}
            <Button
              mode="outlined"
              style={{ width: 175, marginTop: 5 }}
              onPress={handleChooseImage}
            >
              Choose image
            </Button>
          </>
        ) : null}
        <View style={{ height: 10 }}></View>

        {isEditing ? (
          <>
            <Subheading style={{ color: colors.primary }}>Type</Subheading>
            <DropDown
              mode={'outlined'}
              visible={showDropDown}
              showDropDown={() => setShowDropDown(true)}
              onDismiss={() => setShowDropDown(false)}
              value={type}
              setValue={setType}
              list={mealTypeList}
            />
            <View style={{ height: 10 }}></View>
          </>
        ) : (
          <View style={{ height: 24 }}></View>
        )}
        <Subheading style={{ color: colors.primary }}>Ingredients</Subheading>
        {isEditing ? (
          <>
            <TextInput
              mode="outlined"
              value={ingredients}
              onSubmitEditing={Keyboard.dismiss}
              onChangeText={text => handleIngredientsChange(text)}
            />
            {isValidIngredients ? null : (
              <ValidationError
                errorMsg={'Ingredients must be 4-100 characters long.'}
              />
            )}
          </>
        ) : (
          <Text style={{ textAlign: 'justify' }}>{mealInfo.ingredients}</Text>
        )}
        <View style={{ height: 10 }}></View>
        <Subheading style={{ color: colors.primary }}>
          Preparation time (min)
        </Subheading>
        {isEditing ? (
          <NumericInput
            onSubmitEditing={Keyboard.dismiss}
            type="plus-minus"
            value={prepTime}
            onChange={value => setPrepTime(Math.abs(value))}
            borderColor={colors.backdrop}
            minValue={0}
            maxValue={999}
            rounded
            containerStyle={{ marginTop: 5 }}
          />
        ) : (
          <Text style={{ textAlign: 'justify' }}>{mealInfo.prep_time}</Text>
        )}
        <View style={{ height: 10 }}></View>
        <Subheading style={{ color: colors.primary }}>Calories</Subheading>
        {isEditing ? (
          <NumericInput
            onSubmitEditing={Keyboard.dismiss}
            type="plus-minus"
            value={calories}
            onChange={value => setCalories(Math.abs(value))}
            borderColor={colors.backdrop}
            minValue={0}
            maxValue={9999}
            rounded
            containerStyle={{ marginTop: 5 }}
          />
        ) : (
          <Text style={{ textAlign: 'justify' }}>{mealInfo.calories}</Text>
        )}
        {!isEditing ? (
          <>
            <View style={{ height: 10 }}></View>
            <Subheading style={{ color: colors.primary }}>Trainer</Subheading>
            <Text
              style={{ textAlign: 'justify' }}
            >{`${mealInfo.trainer_full_name} (${mealInfo.trainer_username})`}</Text>
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
            {mealInfo.description}
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
            if (isEditing) handleUpdateCreateMeal();
            else setIsEditing(!isEditing);
          }}
        />
      ) : null}
    </View>
  );
};

export default MealInfoScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mealHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  mealSubheadingContainer: {
    flex: 1,
    paddingHorizontal: 16,
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
