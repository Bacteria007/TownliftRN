import { StyleSheet } from 'react-native';
import AppColors from '../../assets/colors/Appcolors';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import FontFam from '../fontstyle/FontFam';
import FontSize from '../sizes/FontSize';

export default TextStyles = StyleSheet.create({
    btnTitle: {
        fontSize: wp(4),
        fontFamily: FontFam.regularFont,
        color: AppColors.btnTitleColor,
        textAlign: 'center',
        textAlignVertical: 'center',
        fontWeight: '500',
    },
    mediumText: {
        fontSize: wp(4),
        fontFamily: FontFam.regularFont,
        fontWeight: '400',
        textAlign: 'center',
        textAlignVertical: 'center',
        color: AppColors.btnTitleColor,
    },
    heading24: {
        fontFamily: FontFam.mediumFont,
        fontWeight: '600',
        textAlign: 'center',
        // textAlignVertical: 'center',
        fontSize: FontSize.xlargeText,
        color: AppColors.black,
    },
    submitBtnTitle: {
        fontFamily: FontFam.mediumFont,
        fontWeight: '600',
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: FontSize.mediumText,
        color: AppColors.white,
    },
    inputLabel: {
        fontFamily: FontFam.regularFont,
        fontWeight: '400',
        textAlignVertical: 'center',
        fontSize: FontSize.smallText,
        color: AppColors.labelTextColor,
    },
    shopName: {
        fontFamily: FontFam.regularFont,
        fontWeight: '400',
        textAlignVertical: 'center',
        fontSize: FontSize.smallText,
        color: AppColors.shopName,
    },
    shopDesc: {
        fontFamily: FontFam.regularFont,
        fontWeight: '400',
        textAlignVertical: 'center',
        fontSize: FontSize.smallText,
        color: AppColors.shopDesc,
        lineHeight:18,

    },
    shopAddr: {
        fontFamily: FontFam.semiBoldFont,
        fontWeight: '400',
        textAlignVertical: 'center',
        fontSize: FontSize.xsmallText,
        color:  AppColors.shopName,
        lineHeight:18,

    },
    userName: {
        fontFamily: FontFam.boldFont,
        fontWeight: '600',
        textAlignVertical: 'center',
        fontSize: FontSize.largeText,
        color: AppColors.userName,
    },
    popularNear: {
        fontFamily: FontFam.semiBoldFont,
        fontWeight: '500',
        textAlignVertical: 'center',
        fontSize: FontSize.xxlargeText,
        color: AppColors.popularNear,
        marginLeft:18,
    },
    
});
