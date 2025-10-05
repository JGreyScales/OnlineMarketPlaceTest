import React, { useEffect, useState } from 'react';
import { Modal, TextInput, View, ActivityIndicator, TouchableOpacity, Text, Image, ScrollView } from 'react-native';
import { CustomButton } from '../functions/CustomButton';
import { useRoute } from '@react-navigation/native';
import { GlobalStyles, colors } from '../functions/globalStyleSheet';
import SessionStorage from 'react-native-session-storage';


export default function sellerPOVHomepage({navigation}){
    const route = useRoute();
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null);

    const [sellerID, setSellerID] = useState('home')

    const [userIsSeller, setUserIsSeller] = useState(false)
    const [sellerDetails, setSellerDetails] = useState({})


    const getSellerDetails = async () => {
        try {
            const sessionToken = await SessionStorage.getItem('@sessionKey');
            const response = await fetch(`http://localhost:3000/${sellerID}`, {
                method: 'GET',
                headers: {
                    Authorization: sessionToken
                }
            })

            if (!response.ok) {
                if (response.status === 404){
                    userIsSeller(false)
                    setLoading(false)
                } else {
                    setError('error gathering seller details')
                }
                return
            }

            const data = await response.json()

            sellerDetails.storepageBio = data.storepageBio
            sellerDetails.storepagePhoto = data.storepagePhoto
            sellerDetails.storepageName = data.storepageName
            setUserIsSeller(true)
            setLoading(false)
        } catch (error) {
            setError('Error fetching seller details:' + error.message)
        }
    }

    const getSellerInterests = async () => {
        try {
            const sessionToken = await SessionStorage.getItem('@sessionKey');
            const response = await fetch(`http://localhost:3000/${sellerID}/interests`, {
                method: 'GET',
                headers: {
                    Authorization: sessionToken
                }
            })

            if (!response.ok) {
                setError('error gathering sellers interests')
            }

            const data = (await response.json()).data
            sellerDetails.interests = data.map((interest) => interest.tag)
        } catch (error) {
            setError('Error fetching seller interests:' + error.message)
        }
    }

    useEffect( () => {
        console.log(route.params)
        getSellerDetails()
        getSellerInterests()
    })



    return (
        <View style={GlobalStyles.container}>
          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : error ? (
            <Text style={GlobalStyles.errorText}>{error}</Text>
          ) : (
            <>
              {/* Store Header */}
              <View style={GlobalStyles.storeHeader}>
                <Image
                  source={{ uri: sellerDetails.storepagePhoto }}
                  style={GlobalStyles.storeImage}
                />
                <Text style={GlobalStyles.storeName}>
                  {sellerDetails.storepageName}
                </Text>
                <Text style={GlobalStyles.storeBio}>
                  {sellerDetails.storepageBio}
                </Text>
              </View>
      
              {/* Interests Horizontal Scroll Banner */}
              {sellerDetails.interests && sellerDetails.interests.length > 0 && (
                <View style={{ marginBottom: 20 }}>
                  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 10 }}
                  >
                    {sellerDetails.interests.map((interest, index) => (
                      <View key={index} style={[GlobalStyles.interestChip, { marginRight: 8 }]}>
                        <Text style={GlobalStyles.interestText}>{interest}</Text>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              )}
            </>
          )}
        </View>
      );
      
}