import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import BtnStyles from './BtnStyles'
import TextStyles from '../texts/TextStyles'
import AppColors from '../../assets/colors/Appcolors'
import { useNavigation } from '@react-navigation/native'

export default SubmitBtn = ({ title,onpress }) => {
    return (
        <TouchableOpacity
        onPress={onpress}
            style={[
                BtnStyles.SelectionBtn,
                { backgroundColor: AppColors.primary, marginTop: 20 },
            ]}>
            <Text style={TextStyles.submitBtnTitle}>{title}</Text>
        </TouchableOpacity>
    )
}



// import { StyleSheet, Text, TouchableOpacity } from 'react-native'
// import BtnStyles from './BtnStyles'
// import TextStyles from '../texts/TextStyles'
// import AppColors from '../../assets/colors/Appcolors'
// import { useNavigation } from '@react-navigation/native'
// import Animated, { FadeInDown,entering } from 'react-native-reanimated'

// export default SubmitBtn = ({ title,onpress }) => {
//     const Touch=Animated.createAnimatedComponent(TouchableOpacity)
//     return (
//         <Touch entering={FadeInDown.delay(800).springify()}
//         onPress={onpress}
//             style={[
//                 BtnStyles.SelectionBtn,
//                 { backgroundColor: AppColors.primary, marginTop: 20 },
//             ]}>
//             <Text style={TextStyles.submitBtnTitle}>{title}</Text>
//         </Touch>
//     )
// }



// const styles = StyleSheet.create({})