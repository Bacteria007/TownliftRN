import { Alert, KeyboardAvoidingView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useState } from 'react'
import MainContainer from '../../styles/containers/MainContainer'
import AuthTetxInput from '../../styles/inputs/AuthTetxInput'
import { Icons } from '../../assets/icons/Icons'
import SubmitBtn from '../../styles/buttons/SubmitBtn'
import {  LoginName } from '../../styles/texts/AppName'
import FontFam from '../../styles/fontstyle/FontFam'
import AppColors from '../../assets/colors/Appcolors'
import { useNavigation } from '@react-navigation/native'
import {  loginUrl } from '../../utils/constants/ApiRoutes'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import ServiceProvider from '../../utils/services/ServiceProvider'
import { AppContext } from '../../context/AppContext'

const Login = () => {
    const {updateLoggedInUser}=useContext(AppContext)
    const navigation = useNavigation()
    const [fullName, setFulllName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const handleLogin = async () => {
        if (fullName === '' || password === '' || email === '') {
            Alert.alert('Error', 'Please fill the required fields');
            return;
        } else {
            const formData = new FormData();
            formData.append('name', fullName);
            formData.append('password', password);
            formData.append('email', email);
            const headers = {
                'Content-Type': 'multipart/form-data',
            }
            try {
                const result = await ServiceProvider({ url: loginUrl, data: formData, headers: headers });
                if (result.data.status === true) {
                    // setUser(result.data.data);
                    await AsyncStorage.setItem('user', JSON.stringify(result.data.data));
                    await AsyncStorage.setItem('isUserLoggedIn', '1')
                    updateLoggedInUser(result.data.data);
                    navigation.replace('Dashboard')
                } else {
                    await AsyncStorage.setItem('isUserLoggedIn', '0')
                    Alert.alert(result.data.message);
                }
            } catch (error) {
                await AsyncStorage.setItem('isUserLoggedIn', '0')
                console.log(error.message);
            }
        }

    }
    return (
        <KeyboardAvoidingView style={styles.keyboardAvoiding} behavior="height">
            <MainContainer>
            <ScrollView
                    contentContainerStyle={styles.scrollView}
                    showsVerticalScrollIndicator={false}>
                <LoginName />
                <AuthTetxInput
                    state={fullName}
                    setState={setFulllName}
                    label={'Name'}
                    iconType={Icons.Ionicons}
                    iconName={'person-outline'}
                    placeholder={'Jhon Doe'}
                    keyboard={'default'}
                />
                <AuthTetxInput
                    state={email}
                    setState={setEmail}
                    label={'Email'}
                    iconType={Icons.Ionicons}
                    iconName={'mail-outline'}
                    placeholder={'jhon@gmail.com'}
                    keyboard={'email-address'}
                />
                <AuthTetxInput
                    state={password}
                    setState={setPassword}
                    label={'Password'}
                    iconType={Icons.SimpleLineIcons}
                    iconName={'lock'}
                    placeholder={'*******'}
                    keyboard={'default'}
                />
                <View style={{ justifyContent: 'flex-end', marginTop: 20 }}>
                    <SubmitBtn title={'Login'} onpress={handleLogin} />
                </View>
                <View>
                    <Text style={styles.signupLineText}>
                        Don't have an account ?{" "}
                        <Text style={styles.signupText} onPress={() => navigation.navigate('AuthStack', { screen: 'AuthOptions' })}>Sign Up</Text>
                    </Text>
                </View>
                </ScrollView>
            </MainContainer>
        </KeyboardAvoidingView>
    )
}

export default Login

const styles = StyleSheet.create({
    outecontainer: {
        flex: 1,
        backgroundColor: 'pink',
    },keyboardAvoiding: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    innercontainer: {
        flex: 1,
        backgroundColor: 'purple',
        borderTopRightRadius: 999
    },
    pinkBox: {
        height: '30%',
        backgroundColor: 'pink',
        borderBottomLeftRadius: 150,
    },
    scrollView: {
        flexGrow: 1,
        width: wp(100),
        justifyContent: 'center',
        alignItems: 'center',
    },
    purpleOverlay: {
        position: 'absolute',
        bottom: -150,
        right: -150,
        width: 300,
        height: 300,
        backgroundColor: 'purple',
        borderRadius: 150,
    },
    signupLineText: {
        fontSize: 13,
        fontFamily: FontFam.regularFont,
        color: AppColors.backIconColor,
        marginTop: 15

    },
    signupText: {
        fontSize: 13,
        fontFamily: FontFam.semiBoldFont,
        color: AppColors.primary

    },
});
