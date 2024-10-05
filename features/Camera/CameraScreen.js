import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Alert } from 'react-native';
import { ActionSheetIOS } from 'react-native';


// Function to extract location from the image EXIF data using URI
const extractLocationFromImage = async (imageUri, navigation) => {
  try {
    // Extract EXIF data from image URI using ImagePicker (EXIF support)
    const assetInfo = await ImagePicker.getPhotoInfoAsync(imageUri);
    const exif = assetInfo.exif;

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
    Alert.alert('Error', 'Error extracting location from image.');
    navigation.navigate('Home', { imageUri, location: null });
  }
};

// Function to show the ActionSheet for choosing camera or gallery
const showActionSheet = async (navigation) => {
  ActionSheetIOS.showActionSheetWithOptions(
    {
      options: ['Cancel', 'Upload from Gallery', 'Take Photo'],
      cancelButtonIndex: 0,
    },
    async (buttonIndex) => {
      if (buttonIndex === 1) {
        pickImageFromGallery(navigation);
      } else if (buttonIndex === 2) {
        takePhoto(navigation);
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

export { showActionSheet };
