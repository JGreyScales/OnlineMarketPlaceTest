import React, { useState } from 'react';
import { Platform, StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GlobalStyles, colors } from '../functions/globalStyleSheet';
import SessionStorage from 'react-native-session-storage';

export default function Login({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/user/authenticate', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        SessionStorage.setItem('@sessionKey', data.Authorization);
        navigation.navigate('homepage')
        
      } else {
        const errorData = await response.json();
        
      }
    } catch (error) {
     return
    }
  };

  const handleSignUp = async () => {
    if (!email || !password) {
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/user/create', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        await handleSignIn()
      } else {
        return
      }
    } catch (error) {
      return;
    }
  };

  return (
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.title}>Login</Text>

      <TextInput
        style={GlobalStyles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        style={GlobalStyles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={GlobalStyles.button} onPress={handleSignIn}>
        <Text style={GlobalStyles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[GlobalStyles.button, GlobalStyles.signUpButton]} onPress={handleSignUp}>
        <Text style={GlobalStyles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <StatusBar style="auto" />
    </View>
  );
}