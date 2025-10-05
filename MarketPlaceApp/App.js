// App.js

import React from 'react';
import Login from './SRC/Primary/login';
import UserHomePage from './SRC/Primary/userHomepage';
import ProductsPage from './SRC/MarketPlace/Products';
import ProductInfo from './SRC/MarketPlace/productInfo';
import SellerPage from './SRC/MarketPlace/sellerPage';
import sellerPOVHomepage from './SRC/Primary/sellerPOVHomePage';
import FundControlPage from './SRC/User/fundControl';
import TransactionLog from './SRC/Logs/TransactionLog';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='login'>
        <Stack.Screen name='login' component={Login} options={{ headerShown: false }}/>
        <Stack.Screen name='homepage' component={UserHomePage} options={{ headerShown: false }}/>
        <Stack.Screen name='products' component={ProductsPage} options={{ headerShown: false }}/>
        <Stack.Screen name='productInfo' component={ProductInfo} options={{ headerShown: false }}/>
        <Stack.Screen name='sellerHomepage' component={SellerPage} options={{ headerShown: false }}/>
        <Stack.Screen name='sellerPOVHomepage' component={sellerPOVHomepage} options={{ headerShown: false }}/>
        <Stack.Screen name='fundsControl' component={FundControlPage} options={{ headerShown: false }}/>
        <Stack.Screen name='transaction' component={TransactionLog} options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}
