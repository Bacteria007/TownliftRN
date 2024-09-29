import React, { useContext, useEffect, useState } from 'react'
import auth from '@react-native-firebase/auth';
import { AppName, AuthOptionsAppName } from '../../styles/texts/AppName';
import MainContainer from '../../styles/containers/MainContainer';
import { useNavigation } from '@react-navigation/native';
import { AppContext } from '../../context/AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ServiceProvider from '../../utils/services/ServiceProvider';
import { verifyUserUrl } from '../../utils/constants/ApiRoutes';
import { Alert } from 'react-native';

const Splash = () => {
    const navigation = useNavigation();
    const { updateLoggedInUser } = useContext(AppContext);

    const handleAutoLogin = async () => {
        const currentUserStatus = await AsyncStorage.getItem('isUserLoggedIn')
        const userData = await AsyncStorage.getItem('user');
        const user = JSON.parse(userData);
        const isSignupProccessComplete = await AsyncStorage.getItem('isSignupProccessComplete')
        console.log("splash user", user)
        console.log("splash currentUserStatus", currentUserStatus)
        console.log("splash isSignupProccessComplete", isSignupProccessComplete)
        if (currentUserStatus === '1') {
            if (user.token) {
                try {
                    const result = await ServiceProvider({
                        url: verifyUserUrl(user.id),
                        data: {},
                        token: user?.token,
                        headers: {
                            // 'Content-Type': 'application/json',
                            // 'Content-Type': 'multipart/form-data',
                            'Authorization': ` Bearer ${user?.token}`
                        }
                    })
                    // const r=result.da
                    console.log('ghjk', result.data);
                    if (result.data.status && isSignupProccessComplete === '1') {
                        updateLoggedInUser(result.data.data);
                        navigation.replace('Dashboard')
                    } else if (result.data.status && isSignupProccessComplete === '0') {
                        updateLoggedInUser(result.data.data);
                        navigation.replace('AuthStack', {
                            screen: 'Profile',
                            params: { userData: result.data.data },
                        });
                    }
                    else {
                        console.log('signup process not performed');
                        navigation.replace('AuthStack', { screen: 'AuthOptions' });
                    }
                } catch (error) {
                    console.log('Auto-login failed:', error.message);
                    if (error.message == 'Network Error') {
                        Alert.alert('There was Network Error')
                    } else {
                        navigation.replace('AuthStack', { screen: 'AuthOptions' });
                    }
                }
            } else {
                console.log("async sy currentUserStatus check kia true , Lkn token nai")
                navigation.replace('AuthStack', { screen: 'AuthOptions' });

            }
        } else {
            console.log("async sy currentUserStatus check kia false")
            navigation.replace('AuthStack', { screen: 'AuthOptions' });
        }
    }

    useEffect(() => {
        handleAutoLogin()
    }, []);
    return (
        <MainContainer>
            <AuthOptionsAppName />
        </MainContainer>
    )
}

export default Splash;


// const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
// function autoLogin(user) {
//     if (user) {
//         setIsUserLoggedIn(true)
//         console.log(user);
//         navigation.navigate('Dashboard')
//     } else {
//         navigation.navigate('AuthStack',{screen:'AuthOptions'})
//     }
// }

// useEffect(() => {
//     const subscriber = auth().onAuthStateChanged(autoLogin);
//     return subscriber; // unsubscribe on unmount
// }, []);