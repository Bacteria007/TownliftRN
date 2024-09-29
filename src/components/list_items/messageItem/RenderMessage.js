import { StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import React, { memo, useContext, useEffect } from 'react';
import FontSize from '../../../styles/sizes/FontSize';
import FontFam from '../../../styles/fontstyle/FontFam';
import AppColors from '../../../assets/colors/Appcolors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { FormatTime, GetDay } from '../../../utils/helpers/FormatTime';
import LinearGradient from 'react-native-linear-gradient';
import { createSocket } from '../../../utils/constants/ApiRoutes';
import { AppContext } from '../../../context/AppContext';
import { Icons } from '../../../assets/icons/Icons';
import { useNavigation } from '@react-navigation/native';

const RenderMessage = ({ item, index, msgList,commingFrom }) => {
  // console.log('mg item////',item);
  const { user } = useContext(AppContext);
  const navigation = useNavigation()
  const isSender = item.sender_id == user.id; // Assuming 1 is the logged-in user id, adjust accordingly
  const statusIcon =
    item.status == 'sent' ? (
      // <Icons.AntDesign name="check" color={AppColors.backIconColor} size={12} />
      <></>
    ) : (
      <Icons.FontAwesome name="clock-o" color={AppColors.backIconColor} size={10} />
    );

  const showDate = index === 0 || (new Date(item.createdat).toDateString() !== new Date(msgList[index - 1]?.createdat).toDateString());

  const renderOrderMessage = (msgContent) => {
    const lines = msgContent.split('\n');
    const firstLine = lines[0];
    const middleLines = lines.slice(1, -1);
    const lastLine = lines[lines.length - 1];

    return (
      <View>
        <Text style={styles.msgText}>{firstLine}</Text>
        <View style={styles.dashedLine} />
        {middleLines.map((line, index) => (
          <Text key={index} style={styles.msgText}>{line}</Text>
        ))}
        <View style={styles.dashedLine} />
        <Text style={styles.msgText}>{lastLine}</Text>
      </View>
    );
  };


  return (
    <View key={item.id}>
      {showDate && (
        <View style={styles.dateSeparator}>
          <Text style={styles.dateSeparatorText}>
            {GetDay(item.createdat)}
          </Text>
        </View>
      )}
      {item.type != 'order' ?
        <View style={styles.msgBox(item.sender_id === user.id)}>
          <TouchableOpacity activeOpacity={0.4}>
            <LinearGradient
              colors={[
                AppColors.grad1,
                AppColors.grad1,
                'rgba(129, 140, 250, 0.2)',
                'rgba(129, 140, 250, 0.3)',
              ]}
              start={{ x: 0.2, y: 0 }}
              end={{ x: 0.2, y: 1 }}
              style={styles.gradient}
            >
              <Text style={styles.msgText}>{item.msg_content}</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 4 }}>
                <Text style={styles.msgTime}>{FormatTime(item.createdat)}</Text>
                {isSender && statusIcon}
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        :
        <View style={styles.orderBoxContainer}>
          <View style={styles.orderBox}>
            <LinearGradient
              colors={[
                AppColors.grad1,
                AppColors.grad1,
                'rgba(129, 140, 250, 0.2)',
                'rgba(129, 140, 250, 0.3)',
              ]}
              start={{ x: 0.2, y: 0 }}
              end={{ x: 0.2, y: 1 }}
              style={styles.gradient}
            >
              {renderOrderMessage(item.msg_content)}
              <Text style={styles.msgTime}>{FormatTime(item.createdat)}</Text>
            </LinearGradient>
          </View>
          {commingFrom!='OrderDetails'&&
          <View style={{ alignSelf: 'flex-end', marginTop: 15 }}>
            <TouchableOpacity onPress={() => navigation.replace('OrderDetail',{item:{id:item.order_id,conversation_id:item.conversation_id,createdat:item.createdat}})} style={{ backgroundColor: 'white', elevation: 1, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 }}>
              <Text style={{ fontSize: 10, fontFamily: FontFam.regularFont, color: AppColors.primary }}>Check order</Text>
            </TouchableOpacity>
          </View>
}
        </View>
      }
      <View>
      </View>
    </View>
  );
};

export default memo(RenderMessage);

const styles = StyleSheet.create({
  msgBox: sender => ({
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColors.iconBtnColor,
    alignSelf: sender ? 'flex-end' : 'flex-start',
    marginBottom: hp(1),
    borderRadius: wp(2),
    marginHorizontal: wp(3),
    maxWidth: wp(70),
  }),
  orderBox: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColors.iconBtnColor,
    alignSelf: 'flex-start',
    borderRadius: wp(2),
    maxWidth: wp(70),
  },
  orderBoxContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: hp(1),
    borderRadius: wp(2),
    marginHorizontal: wp(3),
    maxWidth: wp(70),
  },

  msgText: {
    fontSize: FontSize.smallText,
    fontFamily: FontFam.regularFont,
    color: '#000',
  },
  msgTime: {
    fontSize: FontSize.xxsmallText,
    fontFamily: FontFam.regularFont,
    color: AppColors.backIconColor,
    textAlign: 'right',
  },
  gradient: {
    borderRadius: wp(2),
    overflow: 'hidden',
    paddingHorizontal: wp(3),
    paddingVertical: wp(1),
  },
  dateSeparator: {
    backgroundColor: AppColors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: wp(3),
    paddingVertical: wp(1),
    borderRadius: wp(2),
    marginVertical: hp(2),
  },
  dateSeparatorText: {
    fontSize: FontSize.xxsmallText,
    fontFamily: FontFam.regularFont,
    color: AppColors.black,
  },
  dashedLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderStyle: 'dashed',
    marginVertical: 5,
    width: '100%',
  },
});


// import React from 'react';
// import { View, Text, StyleSheet, Image } from 'react-native';
// import FontSize from '../../../styles/sizes/FontSize';
// import { FormatTime } from '../../../utils/helpers/FormatTime';
// import AppColors from '../../../assets/colors/Appcolors';
// import { Icons } from '../../../assets/icons/Icons';

// const RenderMessage = ({ item }) => {
// const isSender = item.sender_id === 1; // Assuming 1 is the logged-in user id, adjust accordingly
// const statusIcon =
//   item.status === 'sent' ? (
//     <Icons.FontAwesome name="check" color="gray" size={10} />
//   ) : (
//     <Icons.FontAwesome name="clock-o" color="gray" size={10} />
//   );

//   return (
//     <View style={[styles.container, isSender ? styles.senderContainer : styles.receiverContainer]}>
//       <View style={styles.messageBox}>
//         <Text style={styles.messageText}>{item.msg_content}</Text>
// <View style={styles.timestampContainer}>
//   <Text style={styles.timestampText}>{FormatTime(item.createdat)}</Text>
//   {isSender && statusIcon}
// </View>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     marginBottom: 10,
//   },
//   senderContainer: {
//     justifyContent: 'flex-end',
//   },
//   receiverContainer: {
//     justifyContent: 'flex-start',
//   },
//   messageBox: {
//     maxWidth: '80%',
//     padding: 10,
//     borderRadius: 10,
//     backgroundColor: '#E2EAF0',
//   },
//   messageText: {
//     color: AppColors.black,
//     fontSize: FontSize.font16,
//     marginBottom: 5,
//   },
//   timestampContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   timestampText: {
//     color: 'gray',
//     fontSize: FontSize.font10,
//     marginRight: 5,
//   },
// });

// export default RenderMessage;
