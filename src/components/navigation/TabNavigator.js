import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import NavigationHeader from './NavigationHeader';

const Tab = createStackNavigator();

const TabNavigator = ({
  title,
  component,
  childTitle = null,
  childComponent = null,
}) => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        options={{
          header: () => <NavigationHeader title={title} />,
        }}
        name={title}
        component={component}
      />
      {childTitle && childComponent ? (
        <Tab.Screen
          options={{
            header: ({ navigation }) => (
              <NavigationHeader
                title={childTitle}
                navigation={navigation}
                goBack={title}
              />
            ),
          }}
          name={childTitle}
          component={childComponent}
        />
      ) : null}
    </Tab.Navigator>
  );
};

export default TabNavigator;
