import {
    Alert,

    Image,
    KeyboardAvoidingView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import React, { useContext, useState } from 'react';
import AuthTetxInput from '../../styles/inputs/AuthTetxInput';
import { Icons } from '../../assets/icons/Icons';
import SubmitBtn from '../../styles/buttons/SubmitBtn';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AppColors from '../../assets/colors/Appcolors';
import TextStyles from '../../styles/texts/TextStyles';
import FontSize from '../../styles/sizes/FontSize';
import FontFam from '../../styles/fontstyle/FontFam';
import { SelectImage } from '../../utils/helpers/LaunchCamera';
import MainContainer from '../../styles/containers/MainContainer';
import ServiceProvider from '../../utils/services/ServiceProvider';
import { handleProfileImageUrl, handleProfileUrl } from '../../utils/constants/ApiRoutes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppContext } from '../../context/AppContext';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { launchImageLibrary } from 'react-native-image-picker';
import AuthHeader from '../../components/headers/AuthHeader';

const CompleteProfile = (props) => {
    const { updateLoggedInUser ,user} = useContext(AppContext)
    // console.log('uu',user);
    const navigation = useNavigation();
    const { userData,authType } = props.route.params;
    console.log('Google userdata', userData);
    // const userData = {
    //     name: '',
    //     phone: '',
    //     email: '',
    //     selectedImage: ''
    // }
    const [fullName, setFulllName] = useState(userData.name || '');
    const [phone, setPhone] = useState(userData.phone);
    const [email, setEmail] = useState(userData.email || '');
    const [password, setPassword] = useState('');

    // Access the response from Firebase
    const [selectedImage, setSelectedImage] = useState({
        uri: '',
        name: 'google_image.jpg',
        type: 'image/jpeg',
    });
    const [isChecked, setIsChecked] = useState(false);

    const handleProfile = async () => {
        if (selectedImage.uri == '' || fullName === '' || password === '' || email === '') {
            Alert.alert('Error', 'Please fill the required fields');
            return;
        } else {
            const formData = new FormData();
            formData.append('image', {
                uri: selectedImage.uri,
                name: selectedImage.name,
                type: selectedImage.type,
            });
            formData.append('name', fullName);
            formData.append('password', password);
            formData.append('email', email);
            if(authType=='phone'){
                formData.append('phone', userData.phone);

            }
            const headers = {
                'Content-Type': 'multipart/form-data',
            }
            try {
                const result = await ServiceProvider({ url: handleProfileUrl, data: formData, headers: headers });
                if (result.data.status == true) {
                    // setUser(result.data.data);
                    await AsyncStorage.setItem('user', JSON.stringify(result.data.data));
                    await AsyncStorage.setItem('isSignupProccessComplete', '1')
                    await AsyncStorage.setItem('isUserLoggedIn', '1')

                    updateLoggedInUser(result.data.data);
                    navigation.replace('Dashboard')
                } else {
                    await AsyncStorage.setItem('isSignupProccessComplete', '0')
                    await AsyncStorage.setItem('isUserLoggedIn', '0')
                    Alert.alert(result.data.message);
                }
            } catch (error) {
                await AsyncStorage.setItem('isSignupProccessComplete', '0')
                await AsyncStorage.setItem('isUserLoggedIn', '0')
                console.log(error.message);
            }
        }
    };


    return (
        <KeyboardAvoidingView style={styles.keyboardAvoiding} behavior="height">
            <MainContainer>
                <AuthHeader title={'Complete Profile'} />
                <ScrollView
                    contentContainerStyle={styles.scrollView}
                    showsVerticalScrollIndicator={false}>
                    <View style={{ flex: 1 }}>
                        <Animated.View entering={FadeInDown.delay(300).springify().duration(100)} style={styles.mycircle}>
                            <TouchableOpacity onPress={() => SelectImage(setSelectedImage)}>
                                <LinearGradient
                                    colors={['#7BE7EB1A', '#727DF81A']} // Gradient colors
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.gradient}>
                                    {selectedImage.uri != '' ? (
                                        <Image
                                            source={{ uri: `${selectedImage.uri}` }}
                                            style={styles.imageStyle}
                                        />
                                    ) : (
                                        <Icons.Entypo name="camera" color={'#738AF6'} size={25} />
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>
                        </Animated.View>

                        <Animated.Text entering={FadeInDown.delay(400).springify().duration(1000)} style={styles.choosePic}>Choose a beautiful picture</Animated.Text>
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

                        <Animated.View entering={FadeInDown.delay(700).springify().duration(1000)} style={styles.bottomMsgContainer}>
                            <TouchableOpacity onPress={() => setIsChecked(!isChecked)}>
                                {isChecked ? (
                                    <Icons.MaterialCommunityIcons
                                        name="checkbox-outline"
                                        size={15}
                                        color={AppColors.black}
                                    />
                                ) : (
                                    <Icons.MaterialCommunityIcons
                                        name="checkbox-blank-outline"
                                        size={15}
                                        color={AppColors.black}
                                    />
                                )}
                            </TouchableOpacity>
                            <View style={styles.bottomLineTextConatiner}>
                                <Text style={styles.termsMsg}>
                                    By signing up you agree to chiro board review
                                </Text>
                                <Text style={styles.termAndCond}>
                                    Terms and conditions.
                                </Text>
                            </View>
                        </Animated.View>
                        {/* <View style={{ flex: 1, justifyContent: 'center' }}> */}
                        <SubmitBtn title={'Complete Profile'} onpress={handleProfile} />
                        {/* </View> */}
                    </View>
                </ScrollView>
            </MainContainer>
        </KeyboardAvoidingView>
    );
};

export default CompleteProfile;

const styles = StyleSheet.create({
    termsMsg: {
        fontFamily: FontFam.regularFont,
        fontWeight: '400',
        textAlignVertical: 'center',
        fontSize: FontSize.xsmallText,
        color: AppColors.labelTextColor,
    },
    choosePic: {
        fontSize: FontSize.smallText,
        fontFamily: FontFam.mediumFont,
        fontWeight: '500',
        textAlign: 'center',
        textAlignVertical: 'center',
        color: AppColors.primary,
        marginTop: 20,
    },
    mycircle: {
        width: wp(25),
        height: wp(25),
        borderRadius: 100,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
    gradient: {
        width: wp(25),
        height: wp(25),
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderRadius: 100,
        borderColor: '#738AF6',
        borderStyle: 'dotted',
    },
    keyboardAvoiding: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollView: {
        flexGrow: 1,
        width: wp(100),
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageStyle: { width: wp(25), height: wp(25), borderRadius: 100 },
    bottomMsgContainer: {
        flexDirection: 'row',
        marginTop: hp(4),
        width: wp(90),
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    bottomLineTextConatiner: { marginLeft: 5, flex: 1 },

    termAndCond: {
        ...TextStyles.inputLabel,
        textDecorationLine: 'underline',
        fontFamily: FontFam.mediumFont
    },
});
