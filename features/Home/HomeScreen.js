import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function HomeScreen({ route }) {
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
