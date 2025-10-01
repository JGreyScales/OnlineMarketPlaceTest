// App.js

import React from 'react';
import Login from './SRC/Primary/login';
import UserHomePage from './SRC/Primary/userHomepage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='login'>
        <Stack.Screen name='login' component={Login}/>
        <Stack.Screen name='homepage' component={UserHomePage} options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}
