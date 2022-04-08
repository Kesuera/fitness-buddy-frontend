import React, { useContext } from 'react';
import { useTheme } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import NavigationHeader from './NavigationHeader';
import LoginScreen from '../screens/shared/LoginScreen';
import RegisterScreen from '../screens/shared/RegisterScreen';
import YouScreen from '../screens/shared/YouScreen';
import SplashScreen from '../screens/shared/SplashScreen';
import FindATrainerScreen from '../screens/client/FindATrainerScreen';
import UserListScreen from '../screens/shared/UserListScreen';
import EventListScreen from '../screens/shared/EventListScreen';
import WorkoutListScreen from '../screens/shared/WorkoutListScreen';
import MealListScreen from '../screens/shared/MealListScreen';
import { AuthContext } from '../context/AuthContext';

const Stack = createNativeStackNavigator();
const BottomTab = createMaterialBottomTabNavigator();
const TopTab = createMaterialTopTabNavigator();
const LeftTab = createStackNavigator();
const MiddleTab = createStackNavigator();
const RightTab = createStackNavigator();

const LeftTabNavigator = () => {
  const { userInfo } = useContext(AuthContext);

  return (
    <LeftTab.Navigator
      screenOptions={{
        header: ({ navigation }) => (
          <NavigationHeader
            title={userInfo.type == 'client' ? 'Find a trainer' : 'Home'}
            navigation={navigation}
          />
        ),
      }}
    >
      <LeftTab.Screen
        name={userInfo.type == 'client' ? 'Find a trainer' : 'Home'}
        component={
          userInfo.type == 'client' ? FindATrainerScreen : TopTabNavigator
        }
      />
    </LeftTab.Navigator>
  );
};

const MiddleTabNavigator = () => {
  const { userInfo } = useContext(AuthContext);

  return (
    <MiddleTab.Navigator
      screenOptions={{
        header: ({ navigation }) => (
          <NavigationHeader
            title={userInfo.type == 'client' ? 'Favourites' : 'Followers'}
            navigation={navigation}
          />
        ),
      }}
    >
      <MiddleTab.Screen
        name={userInfo.type == 'client' ? 'Favourites' : 'Followers'}
        component={userInfo.type == 'client' ? TopTabNavigator : UserListScreen}
      />
    </MiddleTab.Navigator>
  );
};

const RightTabNavigator = () => {
  return (
    <RightTab.Navigator
      screenOptions={{
        header: ({ navigation }) => (
          <NavigationHeader title={'You'} navigation={navigation} />
        ),
      }}
    >
      <RightTab.Screen name="You" component={YouScreen} />
    </RightTab.Navigator>
  );
};

const TopTabNavigator = () => {
  const { colors } = useTheme();
  const { userInfo } = useContext(AuthContext);

  return (
    <TopTab.Navigator
      initialRouteName={userInfo.type == 'client' ? 'Trainers' : 'Events'}
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.backdrop,
        tabBarIndicatorStyle: {
          backgroundColor: colors.primary,
        },
        tabBarLabelStyle: {
          margin: 0,
          padding: 0,
        },
      }}
    >
      {userInfo.type == 'client' ? (
        <TopTab.Screen name="Trainers" component={UserListScreen} />
      ) : null}
      <TopTab.Screen name="Events" component={EventListScreen} />
      <TopTab.Screen name="Workouts" component={WorkoutListScreen} />
      <TopTab.Screen name="Meals" component={MealListScreen} />
    </TopTab.Navigator>
  );
};

const BottomTabNavigator = () => {
  const { userInfo } = useContext(AuthContext);
  const { colors } = useTheme();

  return (
    <BottomTab.Navigator
      initialRouteName="Left tab navigator"
      activeColor={colors.primary}
      inactiveColor={colors.backdrop}
      barStyle={{
        backgroundColor: 'white',
        shadowColor: 'black',
        shadowOpacity: 0.8,
        shadowRadius: 3,
        shadowOffset: {
          height: 1,
          width: 1,
        },
      }}
    >
      <BottomTab.Screen
        name="Left tab navigator"
        component={LeftTabNavigator}
        options={{
          tabBarLabel: userInfo.type == 'client' ? 'Find a trainer' : 'Home',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name={userInfo.type == 'client' ? 'magnify' : 'home'}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <BottomTab.Screen
        name="Middle tab navigator"
        component={MiddleTabNavigator}
        options={{
          tabBarLabel: userInfo.type == 'client' ? 'Favourites' : 'Followers',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="heart" color={color} size={24} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Right tab navigator"
        component={RightTabNavigator}
        options={{
          tabBarLabel: 'You',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account" color={color} size={24} />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
};

const Navigation = () => {
  const { userInfo, splashLoading } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {splashLoading ? (
          <Stack.Screen name="Splash screen" component={SplashScreen} />
        ) : userInfo.token ? (
          <Stack.Screen
            name="Bottom tab navigator"
            component={BottomTabNavigator}
          />
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
