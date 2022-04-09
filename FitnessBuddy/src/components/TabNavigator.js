import { createStackNavigator } from '@react-navigation/stack';
import NavigationHeader from './NavigationHeader';

const Tab = createStackNavigator();

const TabNavigator = ({ title, component }) => {
  return (
    <Tab.Navigator
      screenOptions={{
        header: ({ navigation }) => (
          <NavigationHeader title={title} navigation={navigation} />
        ),
      }}
    >
      <Tab.Screen name={title} component={component} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
