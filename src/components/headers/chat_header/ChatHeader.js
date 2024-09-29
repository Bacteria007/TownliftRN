import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import AppColors from '../../../assets/colors/Appcolors';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Icons } from '../../../assets/icons/Icons';
import { useNavigation } from '@react-navigation/native';
import FontFam from '../../../styles/fontstyle/FontFam';
import FontSize from '../../../styles/sizes/FontSize';

const ChatHeader = ({ title,isShopOnline }) => {
    const navigation = useNavigation();

    return (
        <View style={styles.headerContainer}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <Icons.Feather
                    name="chevron-left"
                    size={wp(6)}
                    color={AppColors.backIconColor}
                />
            </TouchableOpacity>
            <View>
            <Text style={styles.name} numberOfLines={1} textBreakStrategy='balanced'>{title}</Text>
            </View>
        </View>
    );
};

export default ChatHeader;

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: hp(8),
        // backgroundColor: 'red',
        justifyContent: 'flex-start',
        marginTop:hp(3.5)
    },
    backButton: {
        width: hp(5.5),
        height: hp(5.5),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: AppColors.white,
        borderRadius: 100,
        marginLeft: 20,
    },

     name: {
        fontFamily: FontFam.regularFont,
        fontWeight: '400',
        textAlign: 'left',
        fontSize: FontSize.largeText,
        color: AppColors.shopName,
        marginLeft:wp(3)
    },
     status: {
        fontFamily: FontFam.regularFont,
       
        textAlign: 'left',
        fontSize: FontSize.xxsmallText,
        color: AppColors.shopDesc,
        marginLeft:wp(3)
    }
});
