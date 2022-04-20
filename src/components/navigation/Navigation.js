import React, { useContext } from 'react';
import { useTheme } from 'react-native-paper';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import TabNavigator from './TabNavigator';
import LoginScreen from '../../screens/shared/LoginScreen';
import RegisterScreen from '../../screens/shared/RegisterScreen';
import UserProfileScreen from '../../screens/shared/UserProfileScreen';
import SplashScreen from '../../screens/shared/SplashScreen';
import FindATrainerScreen from '../../screens/client/FindATrainerScreen';
import FollowerListScreen from '../../screens/trainer/FollowersListScreen';
import EventListScreen from '../../screens/shared/EventListScreen';
import WorkoutListScreen from '../../screens/shared/WorkoutListScreen';
import MealListScreen from '../../screens/shared/MealListScreen';
import YouScreen from '../../screens/shared/YouScreen';
import FavouriteTrainersListScreen from '../../screens/client/FavouriteTrainersListScreen';
import GettingCallScreen from '../../screens/shared/GettingCallScreen';
import VideoCallScreen from '../../screens/shared/VideoCallScreen';
import MealInfoScreen from '../../screens/shared/MealInfoScreen';
import EventInfoScreen from '../../screens/shared/EventInfoScreen';
import { AuthContext } from '../../context/AuthContext';

const Stack = createNativeStackNavigator();
const BottomTab = createMaterialBottomTabNavigator();
const TopTab = createMaterialTopTabNavigator();

const HomeNavigator = () => {
  const { userInfo } = useContext(AuthContext);
  const LeftTabComponent =
    userInfo.type === 'client' ? FindATrainerScreen : TopTabNavigator;
  const leftTabLabel = userInfo.type === 'client' ? 'Find a trainer' : 'Home';
  const children =
    userInfo.type === 'client'
      ? [
          { title: 'Trainer profile', component: TopTabNavigator },
          { title: 'Meal info', component: MealInfoScreen },
          { title: 'Event info', component: EventInfoScreen },
        ]
      : [
        { title: 'Meal info', component: MealInfoScreen },
        { title: 'Event info', component: EventInfoScreen },
      ];

  return (
    <TabNavigator
      title={leftTabLabel}
      component={LeftTabComponent}
      children={children}
    />
  );
};

const FavouritesNavigator = () => {
  const { userInfo } = useContext(AuthContext);
  const MiddleTabComponent =
    userInfo.type === 'client' ? TopTabNavigator : FollowerListScreen;
  const middleTabLabel =
    userInfo.type === 'client' ? 'Favourites' : 'Followers';
  const children =
    userInfo.type === 'client'
      ? [
          { title: 'Trainer profile', component: TopTabNavigator },
          { title: 'Meal info', component: MealInfoScreen },
          { title: 'Event info', component: EventInfoScreen },
        ]
      : [{ title: 'Follower profile', component: UserProfileScreen }];

  return (
    <TabNavigator
      title={middleTabLabel}
      component={MiddleTabComponent}
      children={children}
    />
  );
};

const YouNavigator = () => {
  return <TabNavigator title={'You'} component={YouScreen} />;
};

const TopTabNavigator = ({ route }) => {
  const { colors } = useTheme();
  const { userInfo } = useContext(AuthContext);

  return (
    <TopTab.Navigator
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
      {userInfo.type === 'client' ? (
        route.name === 'Trainer profile' ? (
          <TopTab.Screen
            name="About"
            initialParams={route.params}
            component={UserProfileScreen}
          />
        ) : (
          <TopTab.Screen
            name="Trainers"
            component={FavouriteTrainersListScreen}
          />
        )
      ) : null}
      <TopTab.Screen name="Events" component={EventListScreen} />
      <TopTab.Screen name="Workouts" component={WorkoutListScreen} />
      <TopTab.Screen
        name="Meals"
        initialParams={route.params}
        component={MealListScreen}
      />
    </TopTab.Navigator>
  );
};

const BottomTabNavigator = () => {
  const { userInfo } = useContext(AuthContext);
  const { colors } = useTheme();
  const middleTabLabel =
    userInfo.type === 'client' ? 'Favourites' : 'Followers';
  const leftTabLabel = userInfo.type === 'client' ? 'Find a trainer' : 'Home';

  return (
    <BottomTab.Navigator
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
        name={`${leftTabLabel} navigator`}
        component={HomeNavigator}
        options={{
          tabBarLabel: leftTabLabel,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name={userInfo.type === 'client' ? 'magnify' : 'home'}
              color={color}
              size={24}
            />
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

// source code: https://github.com/samironbarai/rn-auth/blob/main/src/components/Navigation.js
const Navigation = () => {
  const { userInfo, splashLoading } = useContext(AuthContext);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {splashLoading ? (
        <Stack.Screen name="Splash screen" component={SplashScreen} />
      ) : userInfo.token ? (
        <>
          <Stack.Screen
            name="Bottom tab navigator"
            component={BottomTabNavigator}
          />
          <Stack.Screen name="Video call" component={VideoCallScreen} />
          {userInfo.type === 'trainer' ? (
            <Stack.Screen name="Getting call" component={GettingCallScreen} />
          ) : null}
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default Navigation;
