import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import TextStyles from '../../styles/texts/TextStyles';
import { Icons } from '../../assets/icons/Icons';
import AppColors from '../../assets/colors/Appcolors';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';

const AuthHeader = ({ title,item }) => {
    const navigation = useNavigation();

    return (
        <View style={styles.headerContainer(title)}>
            <TouchableOpacity
                style={styles.backButton(title)}
                onPress={() => {
                    if (title == 'Order Details')
                        navigation.goBack();
                    else
                    navigation.navigate('ShopDetail', { shop_details: item });
                }}>
                <Icons.Feather
                    name="chevron-left"
                    size={wp(6)}
                    color={AppColors.backIconColor}
                />
            </TouchableOpacity>
            <View style={styles.titleContainer}>
                <Text style={TextStyles.heading24}>{title}</Text>
            </View>
        </View>
    );
};
export default AuthHeader
const styles = StyleSheet.create({
    headerContainer: (title) => ({
        flexDirection: 'row',
        alignItems: 'center',
        height: title != '' ? hp(18) : hp(12),

    }),
    backButton: (title) => ({
        width: hp(5.5),
        height: hp(5.5),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: AppColors.white,
        borderRadius: 100,
        marginLeft: 20,
        position: 'absolute',
        left: 0,
    }),
    titleContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
