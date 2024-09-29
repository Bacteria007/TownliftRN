import { Animated, StyleSheet } from "react-native";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AppColors from "../../assets/colors/Appcolors";
import FontSize from "../../styles/sizes/FontSize";
import { useRef } from "react";
import { useAnimatedRef, useScrollViewOffset, useSharedValue } from "react-native-reanimated";
//  Animated styles
export const scrollY = new Animated.Value(0);


export const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false },
);
// Interpolating values for header animation
const headerHeight = scrollY.interpolate({
    inputRange: [0, hp(13)],
    outputRange: [hp(13), hp(9)],
    extrapolate: 'clamp',
});

const profileImageSize = scrollY.interpolate({
    inputRange: [0, hp(8)],
    outputRange: [hp(8), hp(6)],
    extrapolate: 'clamp',
});
const profileImageCircleSize = scrollY.interpolate({
    inputRange: [0, hp(9)],
    outputRange: [hp(9), hp(7)],
    extrapolate: 'clamp',
});

const profileImageMarginTop = scrollY.interpolate({
    inputRange: [0, hp(1)],
    outputRange: [hp(1), hp(2)],
    extrapolate: 'clamp',
});
const nameSize = scrollY.interpolate({
    inputRange: [0, hp(5)],
    outputRange: [FontSize.largeText, FontSize.smallText],
    extrapolate: 'clamp',
});
const greetingSize = scrollY.interpolate({
    inputRange: [0, hp(5)],
    outputRange: [FontSize.smallText, FontSize.xxsmallText],
    extrapolate: 'clamp',
});



export const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: hp(3),
        paddingHorizontal: 18,
        alignItems: 'center',
        width: '100%',
        height: headerHeight,
        marginBottom:-12
    },
    imageAndNameView: {
        marginTop: profileImageMarginTop,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageStyle: {
        height: profileImageSize,
        width: profileImageSize,
        borderRadius: 999,
        borderWidth: 2,
        borderColor: AppColors.white,
    },
    imageCircle: {
        height: profileImageCircleSize,
        width: profileImageCircleSize,
        borderRadius: 999,
        backgroundColor: AppColors.iconBtnColor,
        justifyContent: 'center',
        alignItems: 'center',
    },
    nameAndGreetings: {
        marginLeft: 8
    },
    greetingText: {
        ...TextStyles.inputLabel,
        fontSize: greetingSize
    },
    userName: {
        ...TextStyles.userName,
        fontSize: nameSize,
        marginLeft: 8

    },
    settingIconContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    flatlistContainer: { flex: 1, width: wp(100), marginTop: hp(3) },
    listContentConatiner: {
        justifyContent: 'center',
        alignItems: 'center',
    },


});