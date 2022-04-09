import React, { useContext } from 'react';
import { useTheme } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import TabNavigator from './TabNavigator';
import LoginScreen from '../screens/shared/LoginScreen';
import RegisterScreen from '../screens/shared/RegisterScreen';
import UserProfileScreen from '../screens/shared/UserProfileScreen';
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

const HomeNavigator = () => {
  const { userInfo } = useContext(AuthContext);
  const LeftTabComponent =
    userInfo.type == 'client' ? FindATrainerScreen : TopTabNavigator;

  return <TabNavigator title={'Home'} component={LeftTabComponent} />;
};

const FavouritesNavigator = () => {
  const { userInfo } = useContext(AuthContext);
  const middleTabLabel = userInfo.type == 'client' ? 'Favourites' : 'Followers';
  const MiddleTabComponent =
    userInfo.type == 'client' ? TopTabNavigator : UserListScreen;

  return <TabNavigator title={middleTabLabel} component={MiddleTabComponent} />;
};

const YouNavigator = () => {
  return <TabNavigator title={'You'} component={UserProfileScreen} />;
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
  const middleTabLabel = userInfo.type == 'client' ? 'Favourites' : 'Followers';

  return (
    <BottomTab.Navigator
      initialRouteName="You navigator"
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
        name="Home navigator"
        component={HomeNavigator}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={24} />
          ),
        }}
      />
      <BottomTab.Screen
        name={`${middleTabLabel} navigator`}
        component={FavouritesNavigator}
        options={{
          tabBarLabel: middleTabLabel,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="heart" color={color} size={24} />
          ),
        }}
      />
      <BottomTab.Screen
        name="You navigator"
        component={YouNavigator}
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
