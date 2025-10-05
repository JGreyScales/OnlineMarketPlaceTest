import React, { useEffect, useState } from 'react';
import { Modal, TextInput, View, ActivityIndicator, TouchableOpacity, Text, Image, ScrollView, FlatList } from 'react-native';
import { CustomButton } from '../functions/CustomButton';
import { GlobalStyles, colors } from '../functions/globalStyleSheet';
import SessionStorage from 'react-native-session-storage';


export default function SellerPOVHomepage({ navigation }) {
  const [loadingSeller, setLoadingSeller] = useState(true)
  const [loadingInterests, setLoadingInterests] = useState(true)
  const [loadingProducts, setLoadingProducts] = useState(true)

  const [error, setError] = useState(null);

  const sellerID = 'home'
  const [userIsSeller, setUserIsSeller] = useState(false)
  const [sellerDetails, setSellerDetails] = useState({})

  const [showUpdateProfile, setShowUpdateProfile] = useState(false)
  const [showCreateProduct, setShowCreateProduct] = useState(false)


  const getSellerDetails = async () => {
    try {
      const sessionToken = await SessionStorage.getItem('@sessionKey');
      const response = await fetch(`http://localhost:3000/seller/${sellerID}`, {
        method: 'GET',
        headers: {
          Authorization: sessionToken
        }
      })

      if (!response.ok) {
        if (response.status === 404) {
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
      setLoadingSeller(false)
    } catch (error) {
      setError('Error fetching seller details:' + error.message)
    }
  }

  const getSellerInterests = async () => {
    try {
      const sessionToken = await SessionStorage.getItem('@sessionKey');
      const response = await fetch(`http://localhost:3000/seller/${sellerID}/interests`, {
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
      setLoadingInterests(false)
    } catch (error) {
      setError('Error fetching seller interests:' + error.message)
    }
  }

  const getSellerProducts = async () => {
    try {
      const sessionToken = await SessionStorage.getItem('@sessionKey');
      const response = await fetch(`http://localhost:3000/seller/${sellerID}/products/999`, {
        method: 'GET',
        headers: {
          Authorization: sessionToken
        }
      })

      if (!response.ok) {
        setError('error loading products')
        return
      }

      const data = (await response.json()).data
      sellerDetails.products = data
      setLoadingProducts(false)
    } catch (error) {
      setError('error fetching seller products')
    }
  }

  useEffect(() => {
    getSellerDetails()
    getSellerInterests()
    getSellerProducts()
  }, [])

  if (loadingInterests || loadingProducts || loadingSeller) {
    <ActivityIndicator size="large" color={colors.primary}/>
  }

  if (error) {
    <Text style={GlobalStyles.errorText}>{error}</Text>
  }

  if (!userIsSeller) {
    <>

    </>
  }

  return (
    <View style={{ padding: 16 }}>
      <CustomButton text="Back" onPress={() => navigation.goBack()} />
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
      {sellerDetails.interests && (
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


      <CustomButton text="Update Profile" onPress={() => {setShowUpdateProfile(true)}} />
      <CustomButton text="Create Product" onPress={() => {setShowCreateProduct(true)}} />


      {/* product list */}
      <FlatList
        data={sellerDetails.products}
        keyExtractor={(product, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => {navigation.navigate('SellerPOVProduct', {ProductID: item.productID})}}>
            <View style={GlobalStyles.transactionLogItem}>
              <View style={GlobalStyles.transactionTextGroup}>
                <Text style={GlobalStyles.transactionProduct}>Product Name: {item.productName}</Text>
                <Text style={GlobalStyles.transactionDate}>Product ID:{item.productID}</Text>
              </View>
              <Text style={GlobalStyles.transactionPrice}>${item.productPrice}</Text>
            </View>
          </TouchableOpacity>
        )}>
      </FlatList>

    </View>
  )

}