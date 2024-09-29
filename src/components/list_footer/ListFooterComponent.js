import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { heightPercentageToDP as hp} from 'react-native-responsive-screen'

const ListFooterComponent = () => {
  return (
    <View style={styles.footerHeight}></View>
  )
}

export default ListFooterComponent

const styles = StyleSheet.create({
    footerHeight:{ height: hp(10)}
})