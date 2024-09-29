import { View, Text, TouchableOpacity, Pressable, Animated, Platform, PermissionsAndroid, Linking, Alert } from 'react-native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import auth from '@react-native-firebase/auth';
import { AppContext } from '../../context/AppContext';
import { createSocket, getAllShopsUrl, serverUrl, updateLatLongUrl } from '../../utils/constants/ApiRoutes';
import AppColors from '../../assets/colors/Appcolors';
import ServiceProvider from '../../utils/services/ServiceProvider';
import MainContainer from '../../styles/containers/MainContainer';
import { Icons } from '../../assets/icons/Icons';
import TextStyles from '../../styles/texts/TextStyles';
import { useNavigation } from '@react-navigation/native';
import { RenderDashboardItem } from '../../components/list_items/RenderDashboardItem';
import ListFooterComponent from '../../components/list_footer/ListFooterComponent';
import ListEmptyComponent from '../../components/list_footer/ListEmptyComponent';
import { onScroll, styles } from './style';
import { useAnimatedRef, useScrollViewOffset, useSharedValue } from 'react-native-reanimated';
import Geolocation from '@react-native-community/geolocation';
import { RESULTS } from 'react-native-permissions';
// import Geolocation from 'react-native-geolocation-service'
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Dashboard = () => {
    const navigation = useNavigation();
    const { user, updateLoggedInUser } = useContext(AppContext)
    // console.log(user);
    const listRef = useRef(null);
    const flatlistRef = useAnimatedRef();
    const scrollOffset = useScrollViewOffset(flatlistRef);
    const endScrollLimit = useSharedValue(0);
    const [shops, setShops] = useState([]);
    useEffect(() => {
        checkAndRequestLocationPermission();
    }, []);

    const checkAndRequestLocationPermission = async () => {
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
            getCurrentLocation();
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
        if (Platform.OS === 'android') {
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

    const getCurrentLocation = () => {
        Geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                console.log('location', position.coords);
                updateUserLocation(latitude, longitude);
            },
            (error) => {
                console.log(error.code, error.message);
            },
            { enableHighAccuracy: false, maximumAge: 10000 }
        );
    };

    const updateUserLocation = async (latitude, longitude) => {
        try {
            const formData = new FormData();
            formData.append('latitude', latitude);
            formData.append('longitude', longitude);
            formData.append('id', user?.id)
            const response = await ServiceProvider({
                url: updateLatLongUrl(user?.id),
                data: formData,
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.status) {
                console.log('Location updated successfully');
            } else {
                console.log('Failed to update location');
            }
        } catch (error) {
            console.error('Error updating location:', error);
        }
    };
    const getAllShops = async () => {
        try {
            const result = await ServiceProvider({ url: getAllShopsUrl(user?.id), headers: { 'Content-Type': 'application/json' } })
            if (result.data.status == true) {
                console.log('shop', result.data.data);
                setShops(result.data.data);
            }
        } catch (error) {
            console.error('cathc', error.message);
        }
    };
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) {
            return 'Good Morning👋';
        } else if (hour < 18) {
            return 'Good Afternoon🌞';
        } else {
            return 'Good Evening🌆';
        }
    };
    const handleLogout = async () => {
        try {
            Alert.alert('Logout', 'Are you sure you want to logout ?', [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Logout cancelled'),
                    style: 'cancel',
                    
                },
                {
                text: 'Logout',
                onPress: async () => {
                    await AsyncStorage.setItem('user', '');
                    await AsyncStorage.setItem('isUserLoggedIn', '0')
                    updateLoggedInUser(null);
                    navigation.replace('AuthStack', { screen: 'Login' })
                },
                style:'default',
                
            }],{
                cancelable:true
            })
        }
        catch (error) {
            console.error('Error logging out', error);
        }

    }
    useEffect(() => {
        getAllShops();
    }, []);
    return (
        <MainContainer>
            <Animated.View style={styles.headerContainer}>
                <Pressable>
                    {/* Profile Image and name*/}
                    <Animated.View style={styles.imageAndNameView}>
                        <Animated.View style={styles.imageCircle}>
                            <Animated.Image
                                // source={require('../../assets/images/prof.jpg')}
                                source={{ uri: `${serverUrl}/${user?.profile_url}` }}
                                style={styles.imageStyle}
                            />
                        </Animated.View>
                        <Animated.View style={styles.nameAndGreetings}>
                            <Animated.Text style={styles.greetingText}>  {getGreeting()}  </Animated.Text>
                            <Animated.Text
                                style={styles.userName}
                                numberOfLines={1}
                                ellipsizeMode="tail">

                                {user?.name?.substring(0, 20)}
                            </Animated.Text>
                        </Animated.View>
                    </Animated.View>
                </Pressable>
                {/* settings icon*/}
                {/* <View style={styles.settingIconContainer}>
                    <TouchableOpacity onPress={handleLogout}>
                        <Icons.Ionicons
                            name="power"
                            size={20}
                            color={AppColors.backIconColor}
                        />
                    </TouchableOpacity>
                </View> */}
            </Animated.View>
            <Animated.View
                style={styles.flatlistContainer}
                ref={listRef}>
                <Animated.FlatList
                    ref={flatlistRef}
                    data={shops}
                    ListHeaderComponent={() => <Text style={TextStyles.popularNear}>Popular near you</Text>}
                    renderItem={({ item, index }) => (
                        <RenderDashboardItem
                            index={index}
                            item={item}
                            scrollOffset={scrollOffset}
                            endScrollLimit={endScrollLimit}
                            length={shops.length}
                        />
                    )}
                    ListFooterComponent={() => <ListFooterComponent />}
                    ListHeaderComponentStyle={{ alignSelf: 'flex-start' }}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContentConatiner}
                    onScroll={onScroll}
                    scrollEventThrottle={16}
                    onContentSizeChange={(_w, h) => listRef.current?.measure((_x, _y, _wl, hl, _px, _py) => (endScrollLimit.value = h - hl))}
                    ListEmptyComponent={() => <ListEmptyComponent title={'No shops available'} />}
                    bounces={true}
                    overScrollMode={'auto'}
                />
            </Animated.View>
        </MainContainer>
    );
};

export default Dashboard;



