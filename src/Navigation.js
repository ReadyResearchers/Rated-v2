import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import HomeScreen from './screens/HomeScreen';
import LibraryScreen from './screens/LibraryScreen';
import ProfileScreen from './screens/ProfileScreen';
import DevScreen from './screens/DevScreen';

const Tab = createBottomTabNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#FF6961',
          tabBarInactiveTintColor: '#333333',
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: 'bold',
          },
          tabBarStyle: [
            {
              display: 'flex',
            },
            null,
          ],
          headerTitle: () => null,
          headerBackground: () => (
            <LinearGradient
              colors={['#FF6961', '#FFFFFF']}
              start={[0, 0]}
              end={[0, 1]}
              style={{
                flex: 1,
              }}
            />
          ),
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Library"
          component={LibraryScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="music" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="account-circle"
                color={color}
                size={size}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Dev"
          component={DevScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="code-tags" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
