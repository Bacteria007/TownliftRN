import React, { useContext, useEffect, useState } from 'react';
import { FlatList, StatusBar, StyleSheet, Text, TouchableOpacity, View, TextInput, Button, Alert } from 'react-native';
import MainContainer from '../../styles/containers/MainContainer';
import AuthHeader from '../../components/headers/AuthHeader';
import AppColors from '../../assets/colors/Appcolors';
import TextStyles from '../../styles/texts/TextStyles';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import FontSize from '../../styles/sizes/FontSize';
import FontFam from '../../styles/fontstyle/FontFam';
import ServiceProvider from '../../utils/services/ServiceProvider';
import { fetchOrderChatUrl, fetchOrderDetailsUrl, submitOrderRatingUrl } from '../../utils/constants/ApiRoutes';
import { format, parseISO } from 'date-fns';
import { AppContext } from '../../context/AppContext';
import RenderMessage from '../../components/list_items/messageItem/RenderMessage';
import ReactNativeModal from 'react-native-modal';
import { useNavigation } from '@react-navigation/native';
import { Rating } from 'react-native-ratings';
import BtnStyles from '../../styles/buttons/BtnStyles';

const statusColors = {
    'inprogress': AppColors.primary,
    'on_the_way': 'orange',
    'completed': 'green',
    'cancelled': 'red',
};

const OrderDetail = (props) => {
    const { user } = useContext(AppContext);
    const { item } = props.route.params;
    const statusColor = statusColors[item?.status && item.status] || 'gray';
    const navigation = useNavigation();
    const [orderDetails, setOrderDetails] = useState({});
    const [orderChat, setOrderChat] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [shopDetails, setShopDetails] = useState({});
    const openModal = () => setModalVisible(true);
    const closeModal = () => {
        setModalVisible(false);
        setRating(0);
        setReview('')
    }

    const submitRating = async () => {
        if (rating != 0) {

            console.log(rating);
            console.log(review);
            try {
                const formData = new FormData();
                formData.append('order_id', item.id);
                formData.append('rating', rating);
                formData.append('reviews', review);
                const response = await ServiceProvider({
                    url: submitOrderRatingUrl,
                    data: formData,
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if (response.data.status) {
                    Alert.alert('Success', 'Rating submitted successfully');
                    closeModal();
                } else {
                    Alert.alert('Error', 'Failed to submit rating');
                }
            } catch (error) {
                console.error('Error submitting rating:', error);
                Alert.alert('Error', 'An error occurred while submitting your rating');

            }
        } else {
            Alert.alert('Error', 'Please select a rating');
        }

    };

    const fetchOrderChat = async () => {
        // console.log('order item/////', item);
        try {
            const response = await ServiceProvider({
                url: fetchOrderChatUrl({ orderId: item.id, conversation_id: item.conversation_id }), headers: { 'Content-Type': 'application/json' }
            });

            if (response.data.status) {
                setOrderChat(response.data.data);
            } else {
                console.log('Failed to fetch prev');
            }
        } catch (error) {
            console.error('Error fetching prev orders:', error);
        }
    };

    const fetchOrderDetails = async () => {
        try {
            const response = await ServiceProvider({
                url: fetchOrderDetailsUrl(item.id), headers: { 'Content-Type': 'application/json' }
            });

            if (response.data.status) {
                setOrderDetails(response.data.data);
                console.log('order det//', response.data.data);
                const shop = {
                    id: response.data.data.shop_id,
                    name: response.data.data.shop_name,
                    open_time: response.data.data.open_time,
                    close_time: response.data.data.close_time,
                    address: response.data.data.address,
                    admin_id: response.data.data.admin_id,
                    average_rating: response.data.data.average_rating,
                    delivery_fee: response.data.data.delivery_fee,
                    delivery_time: response.data.data.delivery_time,
                    image: response.data.data.image,
                    lat: response.data.data.lat,
                    lat: response.data.data.long
                };
                setShopDetails(shop)
                //   {"address": "Satellite town main market branch, Gujranwala", "admin_id": 35, "average_rating": "2.67", "close_time": "03:00 PM", "delivery_boys": null, "delivery_fee": "30", "delivery_time": "20-30", "id": 20, "image": "/shop_images/shop5.png1716784665216.png", "lat": "32.34567", "long": "34.345678", "name": "The Grocery Store", "open_time": "10:10 AM"}

                //    { "address": "Satellite town main market branch, Gujranwala",
                //    "admin_id": 35, 
                //    "average_rating": "2.67",
                //     "close_time": "03:00 PM",
                //      "conversation_id": 62, 
                //      "createdat": "2024-06-23T16:35:42.094Z", 
                //      "delivery_boys": null, 
                //      "delivery_fee": "30", 

                //      "delivery_time": "20-30",
                //       "grand_total": "1264",
                //       "id": 20, 
                //      "image": "/shop_images/shop5.png1716784665216.png",
                //       "is_del": false,
                //       "lat": "32.34567",
                //       "long": "34.345678",
                //       "name": "The Grocery Store",
                //       "open_time": "10:10 AM", 
                //      "ordered_items": "ho new ",
                //       "rating": null, 
                //      "reviews": null,
                //       "rider_id": null,
                //       "rider_lat": null,
                //       "rider_long": null, 
                //      "shop_address": "Satellite town main market branch, Gujranwala",
                //       "shop_id": 20, 
                //      "shop_lat": "32.34567",
                //       "shop_long": "34.345678",
                //       "shop_name": "The Grocery Store",
                //       "status": "inprogress", 
                //      "total": "$1,234.00",
                //       "updatedat": null,
                //       "user_id": 110, 
                //       "user_lat": "32.1119476", 
                //       "user_long": "74.1917102"
                // }
                // console.log('order details///', response.data.data);
            } else {
                console.log('Failed to fetch prev');
            }
        } catch (error) {
            console.error('Error fetching order details:', error);
        }
    };


    useEffect(() => {
        fetchOrderChat();
        fetchOrderDetails();
    }, []);

    const date = orderDetails.createdat ? parseISO(orderDetails.createdat) : new Date();
    const day = format(date, 'dd');
    const month = format(date, 'MM');
    const year = format(date, 'yyyy');

    return (
        <MainContainer>
            <StatusBar backgroundColor={'transparent'} barStyle={'dark-content'} />
            <AuthHeader title={'Order Details'} />
            <View style={{ flex: 1, elevation: 4, backgroundColor: AppColors.white, justifyContent: 'space-between' }}>
                <View style={{ backgroundColor: AppColors.white, marginBottom: 14, width: wp(100), flexDirection: "row", height: hp(15), borderRadius: 5 }}>
                    <View style={{ width: wp(25), justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontFamily: FontFam.regularFont, fontSize: FontSize.xxsmallText, color: AppColors.primary }}>
                            Order# {orderDetails.id}
                        </Text>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ width: wp(20), backgroundColor: AppColors.green, borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: '#fff', fontFamily: FontFam.regularFont, fontSize: FontSize.xxlargeText }}>{day}</Text>
                            </View>
                            <Text style={{ fontFamily: FontFam.regularFont, fontSize: FontSize.xxsmallText, color: "#959595" }}>{month} {year}</Text>
                        </View>
                    </View>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ height: hp(1), width: hp(1), borderRadius: 999, backgroundColor: AppColors.black, }}></View>
                        <View style={{ borderStyle: 'dashed', borderWidth: 1, width: 0.5, height: hp(7), marginVertical: 1 }}></View>
                        <View style={{ height: hp(1), transform: [{ rotate: '45deg' }], width: hp(1), backgroundColor: AppColors.black }}></View>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ flex: 0.9, flexDirection: 'column', display: 'flex', justifyContent: 'space-between', height: hp(10) }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={[TextStyles.shopDesc, { color: AppColors.shopName }]} numberOfLines={1} ellipsizeMode="tail">{orderDetails?.shop_name}</Text>

                                <Text onPress={openModal} style={[styles.statusText, { color: AppColors.primary }]}>Rate this order</Text>

                            </View>
                            <Text style={TextStyles.shopAddr} numberOfLines={2} ellipsizeMode='tail'>{orderDetails?.shop_address}</Text>
                        </View>
                    </View>
                </View>
                <FlatList
                    data={orderChat}
                    renderItem={({ item, index }) => (
                        <RenderMessage index={index} item={item} msgList={orderChat} commingFrom={'OrderDetails'} />
                    )}
                />
                <View style={{ backgroundColor: AppColors.white, elevation: 12, paddingVertical: 15, paddingHorizontal: 20, justifyContent: 'space-between', flexDirection: 'row' }}>
                    <TouchableOpacity onPress={() => {
                        if (orderDetails.status == 'on_the_way') {
                            console.log('inside rider_lat ///',orderDetails);

                            // navigation.navigate('TrackOrder', { order_id: orderDetails.id });
                            if (!orderDetails?.rider_lat) {
                                console.log('inside rider_lat ///');
                                navigation.navigate('Map', { item: { lat: shopDetails.lat, long: shopDetails.long } })
                            }
                            navigation.navigate('Map', { item: { lat: orderDetails.rider_lat, long: orderDetails.rider_long } })
                        }
                        else if (orderDetails.status == 'inprogress') {
                            navigation.navigate('Map', { item: { lat: shopDetails.lat, long: shopDetails.long } })
                        }
                        else {
                            return
                        }

                    }}

                        style={[styles.statusBtn, { borderColor: `${statusColor}` }]}>
                        <Text style={[styles.statusText, { color: `${statusColor}` }]}>{orderDetails?.status ? (orderDetails.status == 'inprogress' ? 'IN PROGRESS' : orderDetails.status == 'on_the_way' ? 'ON THE WAY' : orderDetails.status.toLocaleUpperCase()) : ''}</Text>
                    </TouchableOpacity>
                    <View style={{ justifyContent: 'center', alignorderDetailss: 'flex-end' }}>
                        <Text style={TextStyles.inputLabel}>Total: {orderDetails?.total} Rs</Text>
                        <Text style={TextStyles.inputLabel}>Delivery Charges: {orderDetails.delivery_fee} Rs</Text>
                        <Text style={[TextStyles.inputLabel, { fontFamily: FontFam.boldFont }]}>Grand Total: {orderDetails?.grand_total} Rs</Text>
                    </View>
                </View>
            </View>

            {/* Modal for rating */}
            <ReactNativeModal isVisible={isModalVisible} onBackdropPress={closeModal} onBackButtonPress={closeModal} style={styles.modal}>
                <View style={styles.modal_view}>
                    <Text style={styles.modalTitle}>Rate this Order</Text>
                    <Rating
                        showRating
                        onFinishRating={setRating}
                        imageSize={30}
                        startingValue={0}
                        style={{ paddingVertical: 10 }}
                    />
                    <TextInput
                        placeholder="Write your review"
                        value={review}
                        onChangeText={setReview}
                        style={styles.input}
                    />
                    <TouchableOpacity activeOpacity={0.8} style={[BtnStyles.SelectionBtn, { backgroundColor: AppColors.primary, borderRadius: 7 }]} onPress={submitRating}>
                        <Text style={[styles.statusText, { color: AppColors.white }]}>Submit</Text>
                    </TouchableOpacity>

                </View>
            </ReactNativeModal>
        </MainContainer>
    );
};

const styles = StyleSheet.create({
    modal: {
        flex: 1,
        justifyContent: 'flex-end',
        margin: 0
    },
    modal_view: {
        backgroundColor: '#fff',
        padding: 20,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    },
    modalTitle: {
        fontFamily: FontFam.boldFont,
        fontSize: FontSize.largeText,
        textAlign: 'center',
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: AppColors.primary,
        borderRadius: 5,
        padding: 10,
        marginVertical: 10,
        width: '100%',
    },
    submitRatingBtn: {
        backgroundColor: AppColors.primary,
        borderRadius: 5,
        padding: 14,
        textAlign: 'center',
        width: '100%',
        textAlignVertical: 'center',
        justifyContent: 'center',
        alignItems: 'center'
    },
    statusBtn: {
        backgroundColor: AppColors.white,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        // width:100,
        alignSelf: 'flex-start',
        borderWidth: 1
    },
    statusText: {
        fontFamily: FontFam.mediumFont,
        fontSize: 12,
    }
});

export default OrderDetail;
