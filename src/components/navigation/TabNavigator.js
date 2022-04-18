import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import NavigationHeader from './NavigationHeader';

const Tab = createStackNavigator();

const TabNavigator = ({
  title,
  component,
  headerShown = true,
  children = [],
}) => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        options={{
          header: () => <NavigationHeader title={title} />,
          headerShown: headerShown,
        }}
        name={title}
        component={component}
      />
      {children.length !== 0
        ? children.map((child, i) => {
            return (
              <Tab.Screen
                key={i}
                options={{
                  header: ({ navigation }) => (
                    <NavigationHeader
                      title={child.title}
                      navigation={navigation}
                      goBack={title}
                    />
                  ),
                }}
                name={child.title}
                component={child.component}
              />
            );
          })
        : null}
    </Tab.Navigator>
  );
};

export default TabNavigator;
