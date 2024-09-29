import React, { useEffect } from 'react';
import { Text, StyleSheet,Animated, View } from 'react-native';
import FontFam from '../fontstyle/FontFam';
import AppColors from '../../assets/colors/Appcolors';
import { useNavigation } from '@react-navigation/native';
import FontSize from '../sizes/FontSize';
import  { Easing, FadeIn, FadeInDown } from 'react-native-reanimated';

const { Value, timing } = Animated;
const AnimatedText=Animated.createAnimatedComponent(Text)

export const LoginName = () => {
    const navigation = useNavigation();
    const opacity = new Value(0);


    useEffect(() => {
        const fadeInAnimation = timing(opacity, {
            toValue: 0,
            duration: 2000,
            easing: Easing.inOut,
            delay: 1000,
        });
        fadeInAnimation.start();
    }, []);

    return (
        <View  style={[styles.container]}>
             <Text style={styles.text}>Login</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontFamily: FontFam.semiBoldFont,
        color: AppColors.primary,
        fontSize: FontSize.appName,
        textAlign: 'center',
        lineHeight: 105,
    },
    authOptionsAppName: { textAlign: 'center', fontFamily: FontFam.boldFont, lineHeight: 105, color: AppColors.primary, fontSize: FontSize.appName }
});



export const AuthOptionsAppName = () => <AnimatedText 
entering={FadeIn.delay(400).springify()}
 style={styles.authOptionsAppName}>TownLift</AnimatedText>