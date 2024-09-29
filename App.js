import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Splash from './src/screens/splash/Splash';
import Dashboard from './src/screens/dashboard/Dashboard';
import AuthOptions from './src/screens/auth/AuthOptions';
import PhoneAuth from './src/screens/auth/PhoneAuth';
import VerifyOtp from './src/screens/auth/VerifyOtp';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import CompleteProfile from './src/screens/auth/CompleteProfile';
import { LogBox } from 'react-native';
import { AppProvider } from './src/context/AppContext';

import Settings from './src/screens/setting/Settings'
import ShopDetail from './src/screens/shop_detail/ShopDetail';
import AppColors from './src/assets/colors/Appcolors';
import OrderDetail from './src/screens/order_detail/OrderDetail';
import NewOrder from './src/screens/new_order/NewOrder';
import Login from './src/screens/auth/Login';
import { SocketProvider } from './src/context/SocketContext';
import Map from './src/screens/order_detail/Map';
LogBox.ignoreAllLogs();
const App = () => {
  const Stack = createNativeStackNavigator();

  const AuthStack = () => {
    return <Stack.Navigator initialRouteName='Splash' screenOptions={{ headerShown: false, animation: 'ios' }}>
      <Stack.Screen name='Splash' component={Splash} />
      <Stack.Screen name='AuthOptions' component={AuthOptions} />
      <Stack.Screen name='PhoneAuth' component={PhoneAuth} />
      <Stack.Screen name='Login' component={Login} />
      <Stack.Screen name='VerifyOtp' component={VerifyOtp} />
      <Stack.Screen name='Profile' component={CompleteProfile} />
    </Stack.Navigator>
  }
  return (
    <AppProvider>
        <NavigationContainer >
          <Stack.Navigator initialRouteName='AuthStack' screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
            <Stack.Screen name='AuthStack' component={AuthStack} />
            <Stack.Screen name='Dashboard' component={Dashboard} />
            <Stack.Screen name='Settings' component={Settings} />
            <Stack.Screen name='ShopDetail' component={ShopDetail} />
            <Stack.Screen name='OrderDetail' component={OrderDetail} />
            <Stack.Screen name='Map' component={Map} />
            <Stack.Screen name='NewOrder' component={NewOrder}
            // options={{headerShown:true}}
            />
          </Stack.Navigator>
        </NavigationContainer>
    </AppProvider>
  )
}

export default App

// TODOS

// google sign in mn phone nai hy to phone lena hy profile mn or phone verify 
