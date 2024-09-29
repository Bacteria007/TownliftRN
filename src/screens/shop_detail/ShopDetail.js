import { View, Text, Image, TouchableOpacity, StyleSheet, ImageBackground, StatusBar, FlatList, Pressable, ScrollView, Animated } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import MainContainer from '../../styles/containers/MainContainer'
import TextStyles from '../../styles/texts/TextStyles'
import { Icons } from '../../assets/icons/Icons'
import AppColors from '../../assets/colors/Appcolors'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import AuthHeader from '../../components/headers/AuthHeader'
import { useNavigation } from '@react-navigation/native'
import FontFam from '../../styles/fontstyle/FontFam'
import FontSize from '../../styles/sizes/FontSize'
import { createConversationsUrl, fetchPrevOrdersUrl, serverUrl, updateLatLongUr, fetchShopRatingUrl } from '../../utils/constants/ApiRoutes'
import ServiceProvider from '../../utils/services/ServiceProvider'
import { getUserData } from '../../utils/helpers/GetUser'
import { AppContext } from '../../context/AppContext'
import { format, parseISO } from 'date-fns'
import ListEmptyComponent from '../../components/list_footer/ListEmptyComponent'

const ShopDetail = (props) => {
  const { user } = useContext(AppContext);
  const navigation = useNavigation()
  const cardsWidth = wp(95)
  const { shop_details } = props.route.params
  const [isFavorite, setIsFavorite] = useState(false);
  console.log('user', user);
  useEffect(() => {
    if (user?.fav_shops?.includes(shop_details.id.toString())) {
      setIsFavorite(true);
    }
  }, [user, shop_details.id]);
  console.log('shop', shop_details);
  const [prevOrders, setPrevOrders] = useState([])

  const fectchPrevOrders = async () => {
    try {

      const response = await ServiceProvider({
        url: fetchPrevOrdersUrl({ userid: user.id, shopid: shop_details.id }), headers: { 'Content-Type': 'application/json' }
      });

      if (response.data.status) {
        // console.log('Prev Orders fetch successfully', response.data.data);
        setPrevOrders(response.data.data);
      } else {
        console.log('Failed to fetch prev');
      }
    } catch (error) {
      console.error('Error fetching prev orders:', error);
    }
  }
  const handleNewOrder = () => {
    const date = new Date()
    const timestamp = date.toISOString()

    try {
      const formData = new FormData()
      formData.append('user_id', user.id)
      formData.append('shop_id', shop_details.id)
      formData.append('admin_id', shop_details.admin_id)
      formData.append('createdat', timestamp)
      ServiceProvider({
        url: createConversationsUrl, data: formData, headers: {
          // 'Content-Type': 'application/json',
          'Content-Type': 'multipart/form-data',
        }
      })
        .then((res) => {
          if (res.data.status == true) {
            // console.log(res.data.data)
            // setConversation(res.data.data)
            navigation.navigate('NewOrder', { shop_details: shop_details, conversation: res.data.data.conversation })
          }
        })
        .catch((error) => {
          console.log('err', error.message);
        })
    } catch (error) {
      console.error(error.message);
    }
  }
  useEffect(() => {
    fectchPrevOrders()
  }, [])
  // console.log( `${serverUrl}${shop_details.image}` );
  return (
    <MainContainer>
      <StatusBar backgroundColor={'transparent'} translucent barStyle={'light-content'} />
      <ScrollView style={{ flex: 1, width: wp(100), backgroundColor: 'rgba(244, 244, 244, 1)' }}>
        <ImageBackground source={{ uri: `${serverUrl}${shop_details.image}` }} style={{ height: hp(25), width: wp(100), objectFit: 'fill' }}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Icons.Feather
              name="chevron-left"
              size={wp(6)}
              color={AppColors.backIconColor}
            />
          </TouchableOpacity>

        </ImageBackground>
        {/* shop desc */}
        <View style={{ justifyContent: 'space-between', flexDirection: 'row', width: wp(100), alignSelf: "center", padding: 10, elevation: 4, backgroundColor: AppColors.white }}>
          {/* name and fees time */}
          <View style={{ flex: 1 }}>
            <Text style={styles.storeName} >{shop_details.name}</Text>
            <Text style={styles.storeDesc}>{shop_details.delivery_fee} Rs</Text>
            <Text style={styles.storeDesc}>{shop_details.delivery_time} min</Text>
          </View>
          {/*right icons*/}

          <View style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}>
            <View style={{ flexDirection: 'row', marginTop: 8, }}>
              <View style={{ backgroundColor: AppColors.lightGray, borderRadius: 999, padding: 5, justifyContent: 'center', alignItems: 'center' }}>
                <Icons.MaterialCommunityIcons
                  name={isFavorite ? 'cards-heart' : 'cards-heart-outline'}
                  size={17}
                  color={AppColors.green}
                />
              </View>
              <View style={{ backgroundColor: AppColors.lightGray, borderRadius: 999, width: wp(19), justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginLeft: 4 }}>
                <Icons.Fontisto name='star' size={17} color={!shop_details.average_rating ? '#d2d2d2' : '#FFC60A'} />
                <Text style={[TextStyles.shopDesc, { textAlign: 'center', lineHeight: 20, left: 2, color: AppColors.shopName }]}>{shop_details.average_rating ? shop_details.average_rating : '0.0'}</Text>

              </View>
            </View>
          </View>
        </View>
        {/* prev orders list */}
        <FlatList
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ justifyContent: 'center', alignItems: 'center', marginTop: hp(4) }}
          ListHeaderComponent={() => <Text style={[TextStyles.popularNear, { fontSize: FontSize.largeText, marginLeft: 0, alignSelf: 'center', width: cardsWidth }]}>Your Previous Orders</Text>}
          ListFooterComponent={() => <View style={{ height: prevOrders.length > 0 ? hp(10) : 0 }}></View>}
          ListEmptyComponent={() => <ListEmptyComponent title={'No Orders yet'} />}
          data={prevOrders}
          overScrollMode='auto'
          renderItem={({ item }) => {
            const statusColors = {
              'inprogress': AppColors.primary,
              'on_the_way': 'orange',
              'completed': 'green',
              'cancelled': 'red',
            };
            const statusColor = statusColors[item?.status && item.status] || 'gray';

            const date = parseISO(item.createdat);
            const day = format(date, 'dd');
            const month = format(date, 'MM');
            const year = format(date, 'yyyy');
            return (
              <Pressable onPress={() => navigation.navigate("OrderDetail", { item })} style={{ backgroundColor: AppColors.white, height: 'auto', width: 'auto', marginTop: 14,borderRadius: 8 }}>
                <View style={{ backgroundColor: AppColors.white, elevation: 4, width: cardsWidth, height: 'auto', paddingVertical: 10, flexDirection: "row", borderRadius: 8 ,}}>
                  {/* order date */}
                  <View style={{ width: wp(25), justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontFamily: FontFam.regularFont, fontSize: FontSize.xxsmallText, color: AppColors.primary }}>
                      Order# {item.id}
                    </Text>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                      <View style={{ padding: 6, paddingHorizontal: 15, backgroundColor: AppColors.green, borderRadius: 5, justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                        <Text style={{ color: '#fff', fontFamily: FontFam.regularFont, fontSize: FontSize.xxlargeText, textAlignVertical: 'center', textAlign: 'center' }} numberOfLines={1}>{day}</Text>
                      </View>
                      <Text style={{ fontFamily: FontFam.regularFont, fontSize: FontSize.xxsmallText, color: "#959595" }}>{month} {year}</Text>
                    </View>
                  </View>
                  {/* Line */}
                  <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ height: hp(1), width: hp(1), borderRadius: 999, backgroundColor: AppColors.black, }}></View>
                    <View style={{ borderStyle: 'dashed', borderWidth: 1, width: 0.5, height: hp(10), marginVertical: 1 }}></View>
                    <View style={{ height: hp(1), transform: [{ rotate: '45deg' }], width: hp(1), backgroundColor: AppColors.black }}></View>
                  </View>
                  {/* store details */}
                  <View style={{ flex: 1, flexDirection: 'row', paddingLeft:10 }}>
                    <View style={{  flexDirection: 'column', display: 'flex', justifyContent: 'space-between', paddingVertical: 5, }}>
                      <Text style={[styles.storeName]} numberOfLines={1} ellipsizeMode="tail">{item.shop_name}</Text>
                      <Text style={styles.storeAddr} numberOfLines={2} ellipsizeMode='tail'>{item.shop_address}</Text>
                      <View style={[styles.statusBtn, { borderColor: `${statusColor}` }]}>
                        <Text style={[styles.statusText, { color: `${statusColor}` }]}>{item?.status ? (item.status == 'inprogress' ? 'IN PROGRESS' : item.status == 'on_the_way' ? 'ON THE WAY' : item.status.toLocaleUpperCase()) : ''}</Text>
                      </View>
                    </View>
                  </View>
                    {/* icon right */}
                    <Icons.Feather name='chevron-right' size={25} color='#565656' style={{ alignSelf: 'center',marginRight:2}} />
                </View>
              </Pressable >
            )
          }}
        />
      </ScrollView>
      <TouchableOpacity onPress={handleNewOrder} style={styles.new_order_btn}>
        <Text style={styles.new_order_btn_text}>
          New Order
        </Text>
        {/* <Icons.AntDesign name="arrowright" color={AppColors.white} size={20} style={{ marginLeft: 8 }} /> */}
      </TouchableOpacity>
    </MainContainer >
  )
}

export default ShopDetail

const styles = StyleSheet.create({
  backButton: {
    width: hp(5.5),
    height: hp(5.5),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColors.white,
    borderRadius: 100,
    marginLeft: 20,
    position: 'absolute',
    left: 0,
    top: hp(5),
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storeName: {
    fontFamily: FontFam.regularFont,
    fontWeight: '400',
    textAlignVertical: 'center',
    fontSize: FontSize.smallText,
    color: AppColors.shopName,
  },
  storeDesc: {
    fontFamily: FontFam.regularFont,
    fontWeight: '400',
    textAlignVertical: 'center',
    fontSize: FontSize.xsmallText,
    color: AppColors.shopDesc,
    lineHeight: 18,
  },
  storeAddr: {
    fontFamily: FontFam.semiBoldFont,
    fontWeight: '400',
    textAlignVertical: 'center',
    fontSize: 12,
    color: AppColors.shopName,
    lineHeight: 18,
  },
  new_order_btn: {
    width: wp(90),
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginVertical: 10,
    backgroundColor: AppColors.primary,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E2EAF0',
    shadowOffset: { width: 10, height: -5 },
    shadowOpacity: 0.1,
    shadowColor: '#1B74D6',
    shadowRadius: 10,
    elevation: 4,
  },
  new_order_btn_text: {
    fontSize: FontSize.mediumText,
    fontFamily: FontFam.mediumFont,
    color: AppColors.white,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  statusBtn: {
    // marginTop:5,
    backgroundColor: AppColors.white,
    // paddingHorizontal: 8,
    // paddingVertical: 2,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    // width:100,
    alignSelf: 'flex-start',
    // borderWidth: 1
  },
  statusText: {
    fontFamily: FontFam.mediumFont,
    fontSize: 12,
  }
});