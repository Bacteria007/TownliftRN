import AsyncStorage from "@react-native-async-storage/async-storage";

export const getUserData = async (setState) => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData !== null) {
        const user = JSON.parse(userData);
        setState(user)
      } else {
        console.log('no user in asyncstorage');
    }
    } catch (error) {
  
      console.error(error);
    }
  };

export const clearUserData = async (setState) => {
    try {
      const userData = await AsyncStorage.setItem('user','');
      if (userData !== null) {
        const user = JSON.parse(userData);
        setState('')
      } else {
        console.log('no user in asyncstorage');
    }
    } catch (error) {
  
      console.error(error);
    }
  };
