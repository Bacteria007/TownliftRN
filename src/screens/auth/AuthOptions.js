import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import MainContainer from '../../styles/containers/MainContainer';
import { AuthOptionsAppName } from '../../styles/texts/AppName';
import TextStyles from '../../styles/texts/TextStyles';
import BtnStyles from '../../styles/buttons/BtnStyles';
import { useNavigation } from '@react-navigation/native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { FadeInDown } from 'react-native-reanimated';
import FontFam from '../../styles/fontstyle/FontFam';
import AppColors from '../../assets/colors/Appcolors';

const AuthOptions = ({ navigation }) => {
  const Touch = Animated.createAnimatedComponent(TouchableOpacity)
  const handleGoogleLogin = async () => {
    try {
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      // Get the users ID token
      const { idToken } = await GoogleSignin.signIn();
      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      console.log('googleCredential', googleCredential);
      const { user } = await auth().signInWithCredential(googleCredential);
      console.log('authres', user);
      const userInfo = {
        name: user.displayName,
        email: user.email,
        phone: user.phoneNumber,
        profile_url: user.photoURL,
      };
      AsyncStorage.setItem('user', JSON.stringify(userInfo)); // Store user as JSON string

      navigation.replace('AuthStack', {
        screen: 'Profile',
        params: { authType: 'google', userData: userInfo },
      });
    } catch (error) {
      console.log('in gogle sign in function', error);
      if (error.code === GoogleSignin.SignInCanceledError) {
        console.log('Google sign-in canceled');
      } else {
        console.error('Google login error:', error.message);
      }
    }
  };

  useEffect(() => {
    const googleInfo = GoogleSignin.configure({
      forceCodeForRefreshToken: true,
      webClientId:
        '157564680114-bia7mqdeucuicdb06vcuk7rgakfhdcp7.apps.googleusercontent.com',
    });
    console.log('googleInfo', googleInfo);
  }, []);
  return (
    <MainContainer>
      <AuthOptionsAppName />
      <TouchableOpacity entering={FadeInDown.delay(500).springify()} style={styles.googleBtn} onPress={handleGoogleLogin}>
        <Image style={styles.googleIconStyle}
          source={require('../../assets/images/google-logo.png')}
        />
        <Text style={TextStyles.btnTitle}>Continue with Google</Text>
      </TouchableOpacity>
      <TouchableOpacity entering={FadeInDown.delay(600).springify()} style={styles.phoneBtn}
        onPress={() => navigation.navigate('AuthStack', { screen: 'PhoneAuth' })}
      >
        <Image source={require('../../assets/images/telephone.png')} style={styles.googleIconStyle} />
        <Text style={TextStyles.btnTitle}>Continue with Phone</Text>
      </TouchableOpacity>
      <View style={{ justifyContent: 'center', bottom: -hp(25) }}>
        <Text style={styles.signupLineText}>
          Already have an account?{" "}
          <Text style={styles.signupText} onPress={() => navigation.navigate('AuthStack', { screen: 'Login' })}>Login</Text>
        </Text>
      </View>
    </MainContainer>
  );
};

export default AuthOptions;
const styles = StyleSheet.create({
  googleBtn: { ...BtnStyles.SelectionBtn, marginTop: 10 },
  googleIconStyle: {
    height: wp(6),
    width: wp(6),
    marginRight: 10,
    alignSelf: 'center',
  },
  phoneBtn: { ...BtnStyles.SelectionBtn, marginTop: 15 },
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

///============ LOGIN

// import React, { useState, useEffect, useRef } from 'react';
// import { Button, Text, TextInput, TouchableOpacity, View } from 'react-native';
// import auth from '@react-native-firebase/auth';
// import OTPTextInput from 'react-native-otp-textinput';
// import { GoogleSignin } from '@react-native-google-signin/google-signin';

// async function onGoogleButtonPress() {
//   // Check if your device supports Google Play
//   await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
//   // Get the users ID token
//   const { idToken } = await GoogleSignin.signIn();

//   // Create a Google credential with the token
//   const googleCredential = auth.GoogleAuthProvider.credential(idToken);
//   console.log('googleCredential', googleCredential);
//   // Sign-in the user with the credential
//   return auth().signInWithCredential(googleCredential);
// }

// const Login = ({ navigation }) => {
//   const [confirm, setConfirm] = useState(null);
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [code, setCode] = useState('');

//   function autoLogin(user) {
//     if (user) {
//       console.log(user);
//       //  navigation.navigate('Dashboard')
//     }
//   }

// async function phoneSignIn() {
//   const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
//   console.log('phone signin', confirmation);
//   setConfirm(confirmation);
// }

// async function confirmCode() {
//   try {
//     console.log('code', code);
//     await confirm.confirm(code);
//   } catch (error) {
//     console.log('Invalid code.', error);
//   }
// }

// // Effects
// useEffect(() => {
//   const subscriber = auth().onAuthStateChanged(autoLogin);
//   return subscriber; // unsubscribe on unmount
// }, []);
// useEffect(() => {
//   const googleInfo = GoogleSignin.configure({
//     webClientId: '157564680114-bia7mqdeucuicdb06vcuk7rgakfhdcp7.apps.googleusercontent.com',
//   });
// }, [])

//   if (!confirm) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <TextInput
//           value={phoneNumber}
//           placeholder={"Enter phone"}
//           onChangeText={(t) => setPhoneNumber(t)}
//           style={{
//             borderRadius: 10,
//             borderWidth: 2,
//             borderColor: 'gray',
//             width: '90%',
//             fontSize: 20,
//             textDecorationLine: 'none',
//           }}
//         />

//         <TouchableOpacity onPress={() => phoneSignIn()} style={{ width: '50%', backgroundColor: 'purple', padding: 10, margin: 10 }} >
//           <Text style={{ color: 'white', textAlign: 'center' }}>Simple login</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           onPress={() => onGoogleButtonPress()}
//           style={{ width: '50%', backgroundColor: 'orange', padding: 10, margin: 10 }} >
//           <Text style={{ color: 'white', textAlign: 'center' }}>Google</Text>
//         </TouchableOpacity>

//       </View>
//     );
//   }

//   return (
//     <>
//       {/* <TextInput value={code} onChangeText={text => setCode(text)} /> */}

//       <OTPTextInput
//         inputCellLength={1}
//         inputCount={6}
//         keyboardType="numeric"
//         textInputStyle={{ borderColor: 'red', borderWidth: 2, borderRadius: 10 }}
//         tintColor={'orange'}
//         handleTextChange={e => {
//           setCode(e);
//           console.log(e);
//         }}
//       />
//       <Button title="Confirm Code" onPress={() => confirmCode()} />
//     </>
//   );
// };

// export default Login;
