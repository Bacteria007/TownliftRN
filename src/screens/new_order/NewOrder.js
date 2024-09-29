import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Text,
} from 'react-native';
import MainContainer from '../../styles/containers/MainContainer';
import AppColors from '../../assets/colors/Appcolors';
import FontSize from '../../styles/sizes/FontSize';
import FontFam from '../../styles/fontstyle/FontFam';
import {  widthPercentageToDP as wp,  heightPercentageToDP as hp,} from 'react-native-responsive-screen';
import { Icons } from '../../assets/icons/Icons';
import { getAllMessagesUrl, createSocket } from '../../utils/constants/ApiRoutes';
import ServiceProvider from '../../utils/services/ServiceProvider';
import RenderMessage from '../../components/list_items/messageItem/RenderMessage';
import debounce from 'lodash.debounce';
import ChatHeader from '../../components/headers/chat_header/ChatHeader';
import { AppContext } from '../../context/AppContext';

const maxInputHeight = hp(20);
const minInputHeight = hp(7);

const NewOrder = (props) => {
  const { user } = useContext(AppContext)
  const [newMessage, setNewMessage] = useState('');
  const [msgList, setMsgList] = useState([]);
  const [inputHeight, setInputHeight] = useState(minInputHeight);
  const [showScrollToBottomBtn, setShowScrollToBottomBtn] = useState(false);
  const { shop_details, conversation } = props.route.params;
  const flatlistRef = useRef(null);
  const [msgLoader, setMsgLoader] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const socket = createSocket(user?.id);

  const reloadMsgs = () => {
    setRefreshing(true)
    fetchMessages()
    setRefreshing(false)
  }

  const debouncedSetNewMessage = useCallback(debounce((text) => {
    setNewMessage(text);
  }, 400), []);

  const fetchMessages = async () => {
    setMsgLoader(true);
    try {
     
      const result = await ServiceProvider({
        url: getAllMessagesUrl(conversation.id),
        headers: {
          'Content-Type': 'application/json',
        }

      });
      if (result.data.status) {
        console.log('fetching');
        setMsgLoader(false);
        setMsgList(result.data.data);
        // setMsgList(prevMessages => offset === 0 ? result.data.data : [...prevMessages, ...result.data.data]);
        // offset += limit;
        scrollToBottom();
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleSend = async () => {

    if (newMessage === '') {
      return;
    } else {
      try {
        const currentDate = new Date();
        const timestamp = currentDate.toISOString();
        const message = {
          sender_id: user.id,
          receiver_id: shop_details.admin_id,
          msg_content: newMessage,
          conversation_id: conversation.id,
          createdat: timestamp,
          status: 'pending', // Set initial status to 'pending'
        };
        scrollToBottom();
        setNewMessage('');
        socket.emit('send_message', message, (ack) => {
          if (ack.status) {
            // console.log(ack);
            setMsgList((prev) => [...prev, message]);
            // Update message status to 'sent'
            setMsgList((prev) => prev.map((msg) => msg.createdat == timestamp ? { ...msg, status: 'sent' } : msg));
          }
        });
      } catch (error) {
        console.error(error);
        setNewMessage('');
      }
    }
  };

  const handleContentSizeChange = (contentWidth, contentHeight) => {
    setInputHeight(Math.min(Math.max(minInputHeight, contentHeight), maxInputHeight));
  };

  const handleScroll = (event) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    const layoutHeight = event.nativeEvent.layoutMeasurement.height;

    // Show the button if the user is not at the bottom of the list
    setShowScrollToBottomBtn(currentOffset + layoutHeight < contentHeight);
  };

  const scrollToBottom = () => {
    if (msgList) {
      if (flatlistRef.current && msgList.length > 0) {
        flatlistRef.current.scrollToEnd({ behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [msgList]);

  useEffect(() => {
      socket.emit('join_private_chat', conversation.id);
  }, []);

  useEffect(() => {
      socket.on('receive_message', (msgData) => {
        setMsgList((prev) => [...prev, msgData]);
        scrollToBottom();
      });

      return () => {
        socket.off('receive_message');
      };
  }, [socket]);

  const loadMore=()=>{
    fetchMessages()
  }

  const _renderItem = ({ item, index }) => (
    <RenderMessage item={item} index={index} msgList={msgList}  commingFrom={'NewOrder'}/>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <MainContainer>
        <View style={{ flex: 1, width: wp(100) }}>
          <ChatHeader title={shop_details.name} img={shop_details.image} />
          {/* <Text style={{color:AppColors.primary,textAlign:'center'}} onPress={()=>loadMore()}>load more...</Text> */}
          {msgLoader ? (
            <ActivityIndicator size={20} color={AppColors.primary} />
          ) : (
            <FlatList
              ref={flatlistRef}
              data={msgList}
              renderItem={_renderItem}
              keyExtractor={(item) => item.id?.toString()}
              onScroll={handleScroll}
              initialNumToRender={10}
              maxToRenderPerBatch={20}
              windowSize={5}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={reloadMsgs}
                  tintColor="#7E8DF5"
                />
              }
              scrollEventThrottle={16}
              contentContainerStyle={{ flexGrow: 1 }}
              onContentSizeChange={() => {

                scrollToBottom();

              }}
            />
          )}
        </View>
        <View style={[styles.inputContainer, { height: inputHeight }]}>
          <TextInput
            placeholder="Write here..."
            value={newMessage}
            onChangeText={(text) => setNewMessage(text)}
            placeholderTextColor={AppColors.plalceHolderColor}
            style={styles.input}
            multiline={true}
            onContentSizeChange={({ nativeEvent }) =>
              handleContentSizeChange(
                nativeEvent.contentSize.width,
                nativeEvent.contentSize.height,
              )
            }
          />

            <TouchableOpacity style={styles.btn} onPress={handleSend}>
              <Icons.Ionicons name="send-sharp" color="black" size={20} />
            </TouchableOpacity>
        </View>
        {showScrollToBottomBtn && (
          <TouchableOpacity style={styles.scrollToBottomBtn} onPress={scrollToBottom}>
            <Icons.Feather name="chevron-down" color="black" size={18} />
          </TouchableOpacity>
        )}
      </MainContainer>
    </KeyboardAvoidingView>
  );
};

export default NewOrder;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: wp(3),
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2EAF0',
    backgroundColor: '#fff',
    justifyContent: 'center',
    width: wp(90),
    minHeight: minInputHeight,
    maxHeight: maxInputHeight,
    alignItems: 'center',
    shadowOffset: { width: 10, height: -5 },
    shadowOpacity: 0.1,
    shadowColor: '#1B74D6',
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 5,
  },
  input: {
    flex: 1,
    fontSize: FontSize.smallText,
    fontFamily: FontFam.regularFont,
    textAlignVertical: 'center',
  },
  btn: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollToBottomBtn: {
    position: 'absolute',
    bottom: hp(10),
    right: wp(5),
    backgroundColor: '#fff',
    borderRadius: 100,
    padding: wp(1.5),
    elevation: 4,
  },
});
