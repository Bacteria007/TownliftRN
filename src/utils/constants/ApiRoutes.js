import { io } from 'socket.io-client';
export const serverUrl = 'http://192.168.1.24:3004';

// export const serverUrl = 'http://192.168.1.6:3004';
;
let socketInstance = null;

export const createSocket = (id) => {
  if (socketInstance === null) {
    socketInstance = io.connect(serverUrl, {
      extraHeaders: {
        userid: id
      }
    });
  }
  // console.log({socketInstance});
  return socketInstance;
};
export const handleProfileUrl = `${serverUrl}/user/set-profile`;
export const loginUrl = `${serverUrl}/user/login`;
export const handleProfileImageUrl = `${serverUrl}/user/set-profile-image`;
export const getAllShopsUrl = (userId)=> {return `${serverUrl}/shop/all_shops/${userId}`};
export const updateLatLongUrl = (id) => { return `${serverUrl}/user/update-lat-long/${id}`; }
export const fetchPrevOrdersUrl = (data) => { return `${serverUrl}/order/user-prev-orders/${data.userid}/${data.shopid}`; }
export const fetchOrderChatUrl = (data) => { return `${serverUrl}/messages/order-chat/${data.orderId}/${data.conversation_id}` };
export const fetchOrderDetailsUrl = (id) =>  `${serverUrl}/order/order-details/${id}` ;
export const createConversationsUrl = `${serverUrl}/messages/create-conversation`;
export const getAllMessagesUrl = (id) => { return `${serverUrl}/messages/all-messages/${id}` };

export const verifyUserUrl = (id) => { return `${serverUrl}/user/verify/${id}` }
export const sendMessageUrl = `${serverUrl}/messages/send-message`
export const submitOrderRatingUrl = `${serverUrl}/order/rate-order`
export const fetchShopDetailsUrl = (id) => { return  `${serverUrl}/shop/shop-details/${id}`}
export const addToFavUrl = (data) => { return `${serverUrl}/user/add-shop-to-fav/${data.user_id}/${data.shop_id}` }
export const removeFromFavUrl = (data) => { return `${serverUrl}/user/remove-shop-from-fav/${data.user_id}/${data.shop_id}` }
