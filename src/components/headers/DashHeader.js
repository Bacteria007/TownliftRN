import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'

const DashHeader = () => {
  return (
    <View>
      <Image source={require('../../assets/images/google.png')} style={{ height: hp }} />
    </View>
  )
}

export default DashHeader

const styles = StyleSheet.create({})