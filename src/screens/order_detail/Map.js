import { Image, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import MapView, { Marker, Polyline } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import { Icons } from '../assets/icons/Icons';

const getAddressFromCoords = async (latitude, longitude) => {
  try {
    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyCTMVRsEHL3siYdjZACUmvV10-1jCRYkB4`);
    console.log('Geocoding response:', response.data); // Log the response

    if (
      response.data &&
      response.data.results &&
      response.data.results.length > 0
    ) {
      const firstResult = response.data.results[0];
      const addressComponents = firstResult.address_components;
      const formattedAddress = firstResult.formatted_address;
      console.log('item===>>> ', addressComponents);
      console.log('item===>>> ', formattedAddress);
      return { formattedAddress, addressComponents };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching address:', error);
    return null;
  }
};

const Map = (props) => {
  const { item } = props.route.params;
  console.log('Item:', item);

  const [itemLocation, setItemLocation] = useState({
    latitude: parseFloat(item?.lat) || 0,
    longitude: parseFloat(item?.long) || 0,
  });
  const [currentLocation, setCurrentLocation] = useState(null);
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (item?.lat && item?.long) {
      setItemLocation({
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.long),
      });
    }
  }, [item]);

  useEffect(() => {
    if (itemLocation.latitude !== 0 && itemLocation.longitude !== 0) {
      getAddressFromCoords(itemLocation.latitude, itemLocation.longitude)
        .then((formattedAddress) => {
          if (formattedAddress) {
            setAddress(formattedAddress.formattedAddress);
          } else {
            setAddress('Address not found');
          }
        })
        .catch((error) => {
          console.error('Error fetching address:', error);
          setAddress('Error fetching address');
        });
    }
  }, [itemLocation]);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ latitude, longitude });
      },
      (error) => {
        console.error('Error getting current location:', error);
      },
      { enableHighAccuracy: false, maximumAge: 10000 }
    );
  }, []);

  return (
    <View style={styles.container}>
      {!itemLocation.latitude && !itemLocation.longitude  ? (
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: itemLocation.latitude,
            longitude: itemLocation.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          showsUserLocation={true}
        >
          <Marker
            coordinate={{
              latitude: itemLocation.latitude,
              longitude: itemLocation.longitude,
            }}
            title="Rider Location"
            description={address} 
          />
       
        </MapView>
      ) : (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading map...</Text>
        </View>
      )}
     
    </View>
  );
};

export default Map;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  addressContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  addressText: {
    fontSize: 16,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
  },
});
