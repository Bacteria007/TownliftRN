import { StyleSheet, Text, View } from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import TextStyles from '../../styles/texts/TextStyles';
import FontFam from '../../styles/fontstyle/FontFam';
import AppColors from '../../assets/colors/Appcolors';

const ListEmptyComponent = ({ title }) => {
    return (
        <View style={styles.listEmptyConatiner}>
            <Text style={styles.title}>{title}</Text>
        </View>
    );
};

export default ListEmptyComponent;

const styles = StyleSheet.create({
    listEmptyConatiner: {
        flex: 1,
        alignSelf: 'center',
        height: hp(50),
        width: wp(100),
        justifyContent: 'center',
        alignItems: 'center',
    },
    title:{
        fontSize: wp(3.5),
        fontFamily: FontFam.regularFont,
        textAlign: 'center',
        textAlignVertical: 'center',
        color: AppColors.shopDesc
    }
});
