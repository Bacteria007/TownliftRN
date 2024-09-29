import { Alert, Keyboard, KeyboardAvoidingView, SafeAreaView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import MainContainer from '../../styles/containers/MainContainer';
import TextStyles from '../../styles/texts/TextStyles';
import BtnStyles from '../../styles/buttons/BtnStyles';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AppColors from '../../assets/colors/Appcolors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Icons } from '../../assets/icons/Icons';
import AuthTetxInput from '../../styles/inputs/AuthTetxInput';
import SubmitBtn from '../../styles/buttons/SubmitBtn';
import { useNavigation } from '@react-navigation/native';
import AuthHeader from '../../components/headers/AuthHeader';
import auth from '@react-native-firebase/auth'

const PhoneAuth = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const phoneRegex = /^\+92\d{10}$/;
  const handlePhoneAuth = async () => {
    if (phoneNumber !== '') {
      if (phoneRegex.test(phoneNumber)) {
        try {
          const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
          console.log('signInWithPhoneNumber', confirmation);
          
            navigation.replace('AuthStack', { screen: 'VerifyOtp', params: { confirmation: confirmation } });
        } catch (error) {
          if (error.code === 'auth/invalid-phone-number') {
            Alert.alert('Invalid Number', 'The phone number provided is incorrect');
          } else {
            Alert.alert('Error', 'Failed to send OTP. Please try again later.');
            console.error('Phone authentication error:', error);
          }
        }
      } else {
        Alert.alert('Phone number is invalid!')
      }
    } else {
      Alert.alert('Please enter phone number!');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView style={styles.keyboardAvoid} behavior="height">
        <MainContainer>
          <AuthHeader title={'Sign In'} />
          <View style={styles.contentContainer}>
            <AuthTetxInput
              state={phoneNumber}
              setState={setPhoneNumber}
              label={'Phone Number'}
              iconType={Icons.AntDesign}
              iconName={'phone'}
              placeholder={'+92 3000000000'}
              keyboard={'numeric'}
            />
            <SubmitBtn title={'Send Otp'} onpress={handlePhoneAuth} />
          </View>
        </MainContainer>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default PhoneAuth;
const styles = StyleSheet.create({
  keyboardAvoid: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  contentContainer: {
    backgroundColor: AppColors.white,
    flex: 1,
    borderWidth: 1,
    elevation: 2,
    borderColor: 'white',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    width: wp(100),
    justifyContent: 'flex-start',
    alignItems: 'center',

  },


})