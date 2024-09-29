import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, { useContext, useState } from 'react';
import AuthHeader from '../../components/headers/AuthHeader';
import SubmitBtn from '../../styles/buttons/SubmitBtn';
import { useNavigation, useRoute } from '@react-navigation/native';
import AppColors from '../../assets/colors/Appcolors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Icons } from '../../assets/icons/Icons';
import AuthTetxInput from '../../styles/inputs/AuthTetxInput';
import BtnStyles from '../../styles/buttons/BtnStyles';
import TextStyles from '../../styles/texts/TextStyles';
import MainContainer from '../../styles/containers/MainContainer';
import { AppContext } from '../../context/AppContext';

const VerifyOtp = props => {
  const { user } = useContext(AppContext)
  const currentUser=user
  const { confirmation } = props.route.params;
  const [otp, setOtp] = useState('');

  const verifyOtp = async () => {
    if (otp != '') {
      try {
        const { user } = await confirmation.confirm(otp);
        const userInfo = {
          name: user.displayName,
          email: user.email,
          phone: user.phoneNumber,
          profile_url: user.photoURL,
        };
        console.log('in phone auth ', user);


        if (currentUser) {
          props.navigation.replace('Dashboard');
        }
        props.navigation.replace('AuthStack', {
          screen: 'Profile',
          params: { authType:'phone',userData: userInfo },
        });
      } catch (error) {
        console.error('Error verifying OTP:', error);
        Alert.alert('Error', 'Invalid OTP. Please try again.');
      }
    } else {
      Alert.alert('Please enter otp we sent to you');
    }
  };

  return (
    <MainContainer>
      <AuthHeader title={'OTP Verification'} />
      <View style={styles.enterOtpMsg}>
        <Text style={TextStyles.inputLabel}>
          Enter a 6 digit OTP we have sent on your
        </Text>
        <Text style={TextStyles.inputLabel}>*GIVEN NUMBER*</Text>
      </View>
      <View style={styles.inputAndBtnContainer}>
        <View style={BtnStyles.SelectionBtn}>
          <TextInput
            value={otp}
            onChangeText={t => setOtp(t)}
            style={styles.otpInput}
            keyboardType="numeric"
            maxLength={6}
            placeholder={'123456'}
            placeholderTextColor={AppColors.plalceHolderColor}
          />
        </View>
        <SubmitBtn title={'Verify Code'} onpress={verifyOtp} />
      </View>
    </MainContainer>
  );
};

export default VerifyOtp;

const styles = StyleSheet.create({
  enterOtpMsg: { flexDirection: 'column', width: wp(90) },
  inputAndBtnContainer: {
    backgroundColor: AppColors.white,
    flex: 1,
    width: wp(100),
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  otpInput: {
    justifyContent: 'center',
    alignItems: 'center',
    width: wp(85),
    textAlign: 'center',
  },
});
