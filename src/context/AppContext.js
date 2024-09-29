import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContext, createContext, useState } from 'react'

export const AppContext = createContext()

export const AppProvider = ({ children }) => {
    const serverUrl='http://192.168.1.24:3004'
    const [user, setUser] = useState(null);

    const updateLoggedInUser = obj => {
        setUser(obj);
      };

    return (
        <AppContext.Provider value={{ user, updateLoggedInUser,serverUrl }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = useContext(AppContext)

