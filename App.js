import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

// Screens for the tabs
function HomeScreen({ navigation }) {
  return (
    <View style={styles.screen}>
      <Text>Home Screen</Text>
    </View>
  );
}

function SearchScreen({ navigation }) {
  return (
    <View style={styles.screen}>
      <Text>Search Screen</Text>
    </View>
  );
}

function CameraScreen({ navigation }) {
  return (
    <View style={styles.screen}>
      <Text>Camera Screen</Text>
    </View>
  );
}

function MapScreen({ navigation }) {
  return (
    <View style={styles.screen}>
      <Text>Map Screen</Text>
    </View>
  );
}

function ProfileScreen({ navigation }) {
  return (
    <View style={styles.screen}>
      <Text>User Profile</Text>
    </View>
  );
}

// Create bottom tab navigator
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
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

            // Return the appropriate icon
            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'black',
          tabBarInactiveTintColor: 'gray',
          // Add a texting button (chat icon) in the top-right corner of the header
          headerRight: () => (
            <TouchableOpacity onPress={() => alert('Texting button pressed')}>
              <Icon
                name="chatbubble-outline" // Chat bubble icon
                size={25}
                color="black"
                style={{ marginRight: 15 }}
              />
            </TouchableOpacity>
          ),
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Search" component={SearchScreen} />
        <Tab.Screen name="Camera" component={CameraScreen} />
        <Tab.Screen name="Map" component={MapScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
