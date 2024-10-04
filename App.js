import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActionSheetIOS, Alert } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

// Home Screen where the image and location will be displayed
function HomeScreen({ route }) {
  const { imageUri, location } = route.params || {}; // Retrieve the image URI and location from route params
  const [imageLocation, setImageLocation] = useState(null); // Manage the location state

  useEffect(() => {
    if (location) {
      setImageLocation(location); // Set location if available
    }
  }, [location]);

  return (
    <View style={styles.screen}>
      <Text>Home Screen</Text>
      {imageUri ? (
        <>
          <Image source={{ uri: imageUri }} style={styles.image} />
          {imageLocation ? (
            <Text style={styles.locationText}>
              Location: {imageLocation.city}, {imageLocation.region}
            </Text>
          ) : (
            <Text style={styles.locationText}>No location available</Text>
          )}
        </>
      ) : (
        <Text>No image selected</Text>
      )}
    </View>
  );
}

// Search Screen
function SearchScreen() {
  return (
    <View style={styles.screen}>
      <Text>Search Screen</Text>
    </View>
  );
}

// Map Screen
function MapScreen() {
  return (
    <View style={styles.screen}>
      <Text>Map Screen</Text>
    </View>
  );
}

// Profile Screen
function ProfileScreen() {
  return (
    <View style={styles.screen}>
      <Text>User Profile</Text>
    </View>
  );
}

// Function to extract location from the image EXIF data directly from ImagePicker
const extractLocationFromImage = async (image, navigation) => {
  try {
    const { exif } = image;
    if (exif && exif.GPSLatitude && exif.GPSLongitude) {
      const latitude = exif.GPSLatitude;
      const longitude = exif.GPSLongitude;

      // Reverse geocode the GPS coordinates
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (reverseGeocode.length > 0) {
        const location = reverseGeocode[0];
        navigation.navigate('Home', { imageUri: image.uri, location });
      } else {
        navigation.navigate('Home', { imageUri: image.uri, location: null });
      }
    } else {
      navigation.navigate('Home', { imageUri: image.uri, location: null });
    }
  } catch (error) {
    console.error('Error extracting location:', error);
    Alert.alert('Error', 'Error extracting location from image.');
    navigation.navigate('Home', { imageUri: image.uri, location: null });
  }
};

// Create bottom tab navigator
const Tab = createBottomTabNavigator();

export default function App() {
  const showActionSheet = (navigation) => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Cancel', 'Upload from Gallery', 'Take Photo'],
        cancelButtonIndex: 0,
      },
      async (buttonIndex) => {
        if (buttonIndex === 1) {
          pickImageFromGallery(navigation); // Upload from Gallery option selected
        } else if (buttonIndex === 2) {
          takePhoto(navigation); // Take Photo option selected
        }
      }
    );
  };

  const pickImageFromGallery = async (navigation) => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert('Permission to access gallery is required!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
      exif: true, // Request EXIF data
    });

    if (!result.cancelled) {
      extractLocationFromImage(result, navigation);
    }
  };

  const takePhoto = async (navigation) => {
    let permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      alert('Permission to access the camera is required!');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
      exif: true, // Request EXIF data
    });

    if (!result.cancelled) {
      extractLocationFromImage(result, navigation);
    }
  };

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

            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'black',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Search" component={SearchScreen} />
        <Tab.Screen
          name="Camera"
          component={HomeScreen} // Keep a placeholder screen for Camera tab
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault();
              showActionSheet(navigation); // Show ActionSheet with options to upload or take photo
            },
          })}
        />
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
  image: {
    width: 300,
    height: 300,
    marginTop: 20,
  },
  locationText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
});
