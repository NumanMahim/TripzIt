import React from 'react';
import { ActionSheetIOS } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as FileSystem from 'expo-file-system';

// Import screens from features
import HomeScreen from './features/Home/HomeScreen';
import SearchScreen from './features/Search/SearchScreen';
import MapScreen from './features/Map/MapScreen';
import ProfileScreen from './features/User/ProfileScreen';

// Function to extract location from the image EXIF data using URI
const extractLocationFromImage = async (imageUri, navigation) => {
  try {
    // Extract EXIF data from image URI using FileSystem
    const exifData = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const exif = JSON.parse(exifData).exif;
    
    if (exif && exif.GPSLatitude && exif.GPSLongitude) {
      const { latitude, longitude } = {
        latitude: exif.GPSLatitude,
        longitude: exif.GPSLongitude,
      };
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (reverseGeocode.length > 0) {
        const location = reverseGeocode[0];
        navigation.navigate('Home', { imageUri, location });
      } else {
        navigation.navigate('Home', { imageUri, location: null });
      }
    } else {
      navigation.navigate('Home', { imageUri, location: null });
    }
  } catch (error) {
    console.error('Error extracting location:', error);
    Alert.alert("Error", "Error extracting location from image.");
    navigation.navigate('Home', { imageUri, location: null });
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
      extractLocationFromImage(result.uri, navigation);
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
      extractLocationFromImage(result.uri, navigation);
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
          component={HomeScreen} // Placeholder for Camera tab
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault();
              showActionSheet(navigation); // Show ActionSheet with options
            },
          })}
        />
        <Tab.Screen name="Map" component={MapScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
