import { StatusBar, StyleSheet } from 'react-native'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import AppColors from '../../assets/colors/Appcolors'

const GradientBox = () => {
  return (
    <>
      <StatusBar backgroundColor={'transparent'} translucent barStyle={'dark-content'} />
      <LinearGradient
        useAngle={true}
        angle={180}
        locations={[0.45, 1]}
        colors={[AppColors.grad1, AppColors.white]}
        style={styles.linearGradient}
      />
    </>
  )
}

export default GradientBox
const styles = StyleSheet.create({

  linearGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: wp(100),
    height: hp(25),
    opacity:0.16
  }
});