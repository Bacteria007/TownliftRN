import { StyleSheet } from "react-native";
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
  } from 'react-native-responsive-screen';
  
export default BtnStyles = StyleSheet.create({
    SelectionBtn:{
      borderRadius: 14,
      borderWidth: 1,
      borderColor: '#E2EAF0',
      flexDirection: 'row',
      height: hp(6.5),
      width: wp(90),
      backgroundColor: '#fff',
      justifyContent: 'center',
      width: wp(90),
      height: hp(7),
      marginTop: 5, 
      alignItems: 'center',
      shadowOffset: { width: 10, height: -5 },
      shadowOpacity: 0.1,
      shadowColor: '#1B74D6',
      shadowRadius: 10,
      elevation: 4,
        

      }
})