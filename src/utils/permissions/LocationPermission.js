import { Platform, PermissionsAndroid, Alert, Linking } from 'react-native';
import { PERMISSIONS, RESULTS, openSettings, request } from 'react-native-permissions';
import DeviceInfo from 'react-native-device-info';

export const checkAndRequestLocationPermission = async () => {
  if (Platform.OS === 'android') {
      const permissionStatus = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      if (permissionStatus) {
          checkIfLocationServicesEnabled();
      } else {
          requestLocationPermission();
      }
  } else {
      checkIfLocationServicesEnabled();
  }
};

const checkIfLocationServicesEnabled = async () => {
  const isLocationEnabled = await DeviceInfo.isLocationEnabled();
  if (isLocationEnabled) {
      return true
  } else {
      showEnableLocationAlert();
  }
};

const showEnableLocationAlert = () => {
  Alert.alert(
      'Enable Location Services',
      'Location services are disabled. Please enable them in settings to continue.',
      [
          {
              text: 'Cancel',
              onPress: () => console.log('Location services not enabled'),
              style: 'cancel',
          },
          // {
          //     text: 'Open Settings',
          //     onPress: () => {
          //         Linking.openSettings();
          //     },
          // },
          {
              text: 'Enable',
              onPress: () => {
                  Linking.sendIntent('android.settings.LOCATION_SOURCE_SETTINGS')
                  .catch(() => {
                      console.warn('cannot open settings');
                      Alert.alert(
                          'Error',
                          'Unable to open settings. Please open the settings manually and enable location services.',
                      );
                  });
              }
          }
      ]
  );
};

const requestLocationPermission = async () => {
  let granted;
  if (Platform.OS === 'ios') {
      granted = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
  } else if (Platform.OS === 'android') {
      granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
              title: 'Location Permission',
              message: 'We need access to your location to show you relevant information',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
          }
      );
  }

  if (granted === PermissionsAndroid.RESULTS.GRANTED || granted === RESULTS.GRANTED) {
      checkIfLocationServicesEnabled();
  } else {
      console.log('Location permission denied');
      showPermissionAlert();
  }
};


