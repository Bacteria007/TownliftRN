import React, { useState, useEffect, useContext } from "react";
import { Pressable, TouchableOpacity } from "react-native";
import Animated, { Extrapolate, interpolate, useAnimatedStyle } from "react-native-reanimated";
import { Image, Text, View } from "react-native";
import { Icons } from "../../assets/icons/Icons";
import TextStyles from "../../styles/texts/TextStyles";
import AppColors from "../../assets/colors/Appcolors";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { useNavigation } from "@react-navigation/native";
import { addToFavUrl, removeFromFavUrl, serverUrl } from "../../utils/constants/ApiRoutes";
import ServiceProvider from "../../utils/services/ServiceProvider";
import { AppContext } from "../../context/AppContext";

export const RenderDashboardItem = ({ item, index, scrollOffset, endScrollLimit, length }) => {
    const navigation = useNavigation();
    const { user } = useContext(AppContext);
    const [isFavorite, setIsFavorite] = useState(false);
    console.log(item);
    console.log('user', user);
    
    useEffect(() => {
        if (user?.fav_shops?.includes(item.id.toString())) {
            setIsFavorite(true);
        }
    }, [user, item.id]);

    const listElasticStyle = useAnimatedStyle(() => {
        const scrollValidLimit = scrollOffset.value > 0 ? endScrollLimit.value : 0;
        const gapFactor = Math.abs((scrollOffset.value - scrollValidLimit) / 10);

        return {
            transform: [
                {
                    translateY: interpolate(
                        scrollOffset?.value,
                        [-0.01, 0, endScrollLimit.value + 0.01],
                        [index * gapFactor, 0, 0, -(length - index) * gapFactor],
                        Extrapolate.CLAMP
                    )
                }
            ]
        }
    });

    const addToFav = async () => {
        try {
            const data = {
                shop_id: item.id,
                user_id: user?.id
            };
            const result = await ServiceProvider({
                url: addToFavUrl(data),
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            if (result.data.status) {
                setIsFavorite(true);
                console.log("added to fav");
            } else {
                console.log("not added to fav");
            }
        } catch (error) {
            console.error(error);
        }
    }

    const removeFromFav = async () => {
        try {
            const data = {
                shop_id: item.id,
                user_id: user?.id
            };
            const result = await ServiceProvider({
                url: removeFromFavUrl(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (result.data.status) {
                setIsFavorite(false);
                console.log("removed from fav");
            } else {
                console.log("not removed from fav");
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleFavoriteToggle = () => {
        if (isFavorite) {
            removeFromFav();
        } else {
            addToFav();
        }
    }

    return (
        <Pressable onPress={() => navigation.navigate('ShopDetail', { shop_details: item })}>
            <Animated.View style={[listElasticStyle, { elevation: 4, backgroundColor: AppColors.white, borderRadius: hp(1), marginTop: 10 }]}>
                <Image source={{ uri: serverUrl + item.image }} style={{ height: hp(18), width: wp(90), borderTopLeftRadius: hp(1), borderTopRightRadius: hp(1), objectFit: 'fill' }} />
                <View style={{ marginTop: hp(1.5), justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 12, paddingBottom: 8 }}>
                    <View style={{ flex: 1 }}>
                        <Text style={TextStyles.shopName} numberOfLines={1} ellipsizeMode='tail'>{item.name}</Text>
                        <Text style={TextStyles.shopDesc} numberOfLines={1} ellipsizeMode='tail'>{item.delivery_fee} Rs</Text>
                        <Text style={TextStyles.shopDesc} numberOfLines={1} ellipsizeMode='tail'>{item.delivery_time} min</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Icons.Feather name='chevron-right' size={20} color='#565656' />
                        <View style={{ flexDirection: 'row', marginTop: 8 }}>
                            <TouchableOpacity onPress={handleFavoriteToggle}>
                                <View style={{ backgroundColor: AppColors.lightGray, borderRadius: 999, padding: 5, justifyContent: 'center', alignItems: 'center' }}>
                                    <Icons.MaterialCommunityIcons
                                        name={isFavorite ? 'cards-heart' : 'cards-heart-outline'}
                                        size={17}
                                        color={AppColors.green}
                                    />
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity style={{ backgroundColor: AppColors.lightGray, borderRadius: 999, width: wp(19), justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginLeft: 4 }}>
                                <Icons.Fontisto name='star' size={15} color={!item.average_rating ? '#d2d2d2' : '#FFC60A'} />
                                <Text style={[TextStyles.shopDesc, { textAlign: 'center', lineHeight: 20, left: 2, color: AppColors.shopName }]}>{item.average_rating!=null  ? item.average_rating : '0.0'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Animated.View>
        </Pressable>
    )
}
