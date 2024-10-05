import React from 'react';
import { useColorScheme } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated from 'react-native-reanimated';
import HomeScreen from '../features/Home/HomeScreen';
import SearchScreen from '../features/Search/SearchScreen';
import MapScreen from '../features/Map/MapScreen';
import ProfileScreen from '../features/User/ProfileScreen';
import { showActionSheet } from '../features/Camera/CameraScreen'; // Import the camera functionality

const Tab = createBottomTabNavigator();

export default function Navigation() {
  const colorScheme = useColorScheme(); // Detect system light/dark mode

  // Animate tab transitions using `react-native-reanimated`
  const TabBarIcon = ({ iconName, color, size }) => (
    <Animated.View style={{ transform: [{ scale: 1.1 }] }}>
      <Icon name={iconName} size={size} color={color} />
    </Animated.View>
  );

  return (
    <NavigationContainer theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Tab.Navigator
        screenOptions={({ route, navigation }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = 'home-outline';
            } else if (route.name === 'Search') {
              iconName = 'search-outline';
            } else if (route.name === 'Camera') {
              iconName = 'camera-outline';
            } else if (route.name === 'Map') {
              iconName = 'map-outline';
            } else if (route.name === 'Profile') {
              iconName = 'person-outline';
            }

            return <TabBarIcon iconName={iconName} color={color} size={size} />;
          },
          tabBarShowLabel: false, // Remove labels from the tab bar
          tabBarStyle: {
            backgroundColor: colorScheme === 'dark' ? '#1c1c1c' : '#ffffff',
            borderTopWidth: 0,
            elevation: 10, // For a professional shadow
            height: 60, // Height of the tab bar
          },
          tabBarActiveTintColor: colorScheme === 'dark' ? '#f9a825' : '#6200ea',
          tabBarInactiveTintColor: colorScheme === 'dark' ? '#a1a1a1' : '#888',
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Search" component={SearchScreen} />
        <Tab.Screen
          name="Camera"
          component={HomeScreen} // Placeholder for Camera tab
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault();
              showActionSheet(navigation); // Show ActionSheet when camera button is pressed
            },
          })}
        />
        <Tab.Screen name="Map" component={MapScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
