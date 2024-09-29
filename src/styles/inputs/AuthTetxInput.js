import { StyleSheet, Text, TextInput, View } from 'react-native';
import React from 'react';
import BtnStyles from '../buttons/BtnStyles';
import AppColors from '../../assets/colors/Appcolors';
import TextStyles from '../texts/TextStyles';
import Icon, { Icons } from '../../assets/icons/Icons';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import FontSize from '../sizes/FontSize';
import FontFam from '../fontstyle/FontFam';

const AuthTetxInput = ({
    label,
    placeholder,
    iconType,
    iconName,
    state,
    setState,
    keyboard
}) => {
    console.log(iconType);
    return (
        <View style={{ marginTop: 20 }}>
            <View style={{ width: wp(90), justifyContent: 'center', alignItems: 'flex-start', paddingLeft: wp(1) }}>
                <Text style={TextStyles.inputLabel}>{label}</Text>
            </View>
            <View
                style={[
                    BtnStyles.SelectionBtn,
                    { justifyContent: 'space-between', paddingHorizontal: 8 },
                ]}>
                <TextInput
                    value={state}
                    onChangeText={t => setState(t)}
                    placeholder={placeholder}
                    placeholderTextColor={AppColors.plalceHolderColor}
                    style={{ width: wp(65), fontSize: FontSize.smallText, fontFamily: FontFam.regularFont }}
                    keyboardType={`${keyboard}`}
                    autoCapitalize='none'
                />
                <View
                    style={{
                        height: wp(8),
                        width: wp(8),
                        borderRadius: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: AppColors.iconBtnColor,
                        marginRight: wp(2),
                    }}>
                    <Icon
                        type={iconType}
                        name={iconName}
                        color={AppColors.iconColor}
                        size={20}
                    />
                </View>
            </View>
        </View>
    );
};

export default AuthTetxInput;



// import { StyleSheet, Text, TextInput, View } from 'react-native';
// import React from 'react';
// import BtnStyles from '../buttons/BtnStyles';
// import AppColors from '../../assets/colors/Appcolors';
// import TextStyles from '../texts/TextStyles';
// import Icon, { Icons } from '../../assets/icons/Icons';
// import {
//     widthPercentageToDP as wp,
//     heightPercentageToDP as hp,
// } from 'react-native-responsive-screen';
// import FontSize from '../sizes/FontSize';
// import FontFam from '../fontstyle/FontFam';
// import Animated, { FadeInDown } from 'react-native-reanimated';

// const AuthTetxInput = ({
//     label,
//     placeholder,
//     iconType,
//     iconName,
//     state,
//     setState,
//     keyboard
// }) => {
//     console.log(iconType);
//     return (
//         <View style={{ marginTop: 20 }}>
//             <Animated.View entering={FadeInDown.delay(500).springify()} style={{ width: wp(90), justifyContent: 'center', alignItems: 'flex-start', paddingLeft: wp(1) }}>
//                 <Text style={TextStyles.inputLabel}>{label}</Text>
//             </Animated.View>
//             <Animated.View entering={FadeInDown.delay(600).springify()}
//                 style={[
//                     BtnStyles.SelectionBtn,
//                     { justifyContent: 'space-between', paddingHorizontal: 8 },
//                 ]}>
//                 <TextInput
//                     value={state}
//                     onChangeText={t => setState(t)}
//                     placeholder={placeholder}
//                     placeholderTextColor={AppColors.plalceHolderColor}
//                     style={{ width: wp(65), fontSize: FontSize.smallText, fontFamily: FontFam.regularFont }}
//                     keyboardType={`${keyboard}`}
//                     autoCapitalize='none'
//                 />
//                 <View
//                     style={{
//                         height: wp(8),
//                         width: wp(8),
//                         borderRadius: 10,
//                         justifyContent: 'center',
//                         alignItems: 'center',
//                         backgroundColor: AppColors.iconBtnColor,
//                         marginRight: wp(2),
//                     }}>
//                     <Icon
//                         type={iconType}
//                         name={iconName}
//                         color={AppColors.iconColor}
//                         size={20}
//                     />
//                 </View>
//             </Animated.View>
//         </View>
//     );
// };

// export default AuthTetxInput;

// const styles = StyleSheet.create({});
