import React, { useEffect, useState } from 'react';
import { Modal, TextInput, View, ActivityIndicator, TouchableOpacity, Text, Image, ScrollView } from 'react-native';
import { CustomButton } from '../functions/CustomButton';
import { useRoute } from '@react-navigation/native';
import { GlobalStyles, colors } from '../functions/globalStyleSheet';
import SessionStorage from 'react-native-session-storage';
import Toast from 'react-native-toast-message';

export default function SellerPage({navigation}){
    const route = useRoute();
    const [error, setError] = useState(null)
    const [sellerID, setSellerID] = useState(route.params.sellerID)

    const [loading, setLoading] = useState(true)
    const [loadingSellerDetails, setLoadingSellerDetails] = useState(true)
    const [loadingSellerRatingDetails, setLoadingSellerRatingDetails] = useState(true)
    const [loadingSellerProductsDetails, setLoadingSellerProductsDetails] = useState(true)

    const [sellerContent, setSellerContent] = useState({})
    const [currentPage, setCurrentPage] = useState(0)
    const [totalSellerProductCount, setTotalSellerProductCount] = useState(0)


    const grabSellerRating = async () => {
        try {
            const sessionToken = await SessionStorage.getItem('@sessionKey');
            const response = await fetch(`http://localhost:3000/seller/${sellerID}/rating`, {
                method: 'GET',
                headers: {
                    Authorization: sessionToken
                }
            })

            if (!response.ok){
                if (response.status === 404){
                    Toast.show({
                        type: 'info',
                        text1: 'No ratings for this seller yet'
                    })
                    sellerContent.rating = 0.0
                } else {
                    setError('Unable to retrieve seller rating');
                }
                return;
            }

            const data = parseFloat((await response.json()).rating).toFixed(1)
            sellerContent.rating = data
            setLoadingSellerRatingDetails(false)
        } catch (error) {
            setError('Fetch rating error: ' + error.message)
        }
    }

    const grabSellerInfo = async () => {
        try {
            const sessionToken = await SessionStorage.getItem('@sessionKey');
            const response = await fetch(`http://localhost:3000/seller/${sellerID}`, {
                method: 'GET',
                headers: {
                    Authorization: sessionToken
                }
            })

            if (!response.ok){
                setError('Unable to retrieve seller')
                return;
            }
            const data = await response.json()
            sellerContent.storepageBio = data.storepageBio
            sellerContent.storepagePhoto = data.storepagePhoto
            sellerContent.storepageName = data.storepageName
            setLoadingSellerDetails(false)
            
        } catch (error) {
            setError('Fetch seller error: ' + error.message)
        }
    }

    const grabSellerProducts = async () => {
        try {
            const sessionToken = await SessionStorage.getItem('@sessionKey');
            // fetch 25 products from the seller
            const response = await fetch(`http://localhost:3000/seller/${sellerID}/products/999`, {
                method: 'GET',
                headers: {
                    Authorization: sessionToken
                }
            })

            if (!response.ok){
                if (response.status === 404){
                    setLoadingSellerDetails(false)
                    Toast.show({
                        type: 'info',
                        text1: 'Seller has no products to display'
                    })
                    return
                }
                setError("Unable to retrieve seller products")
                return
            }
            const data = (await response.json()).data
            sellerContent.products = data
            setLoadingSellerProductsDetails(false)
        }
        catch (error) {
            setError('Fetch seller products error:' + error.message)
        }
    }

    useEffect(() => {
        grabSellerInfo()
        grabSellerRating()
        grabSellerProducts()
    }, [route.params])

    useEffect(() => {
        if (!loadingSellerDetails && !loadingSellerProductsDetails && !loadingSellerRatingDetails){
            setLoading(false)
        }
    }, [loadingSellerDetails, loadingSellerProductsDetails, loadingSellerRatingDetails])

    if (error) {
        return (
            <View style={GlobalStyles.center}>
                <Text style={GlobalStyles.errorText}>{error}</Text>
            </View>
        );
    }

    if (loading) {
        return (
          <View style={GlobalStyles.center}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text>Loading...</Text>
          </View>
        );
      }

    return (
        <>
            <CustomButton text="Back" onPress={() => navigation.goBack()} />
            <ScrollView style={GlobalStyles.storePageContainer}>
            {/* Store Header */}
            <View style={GlobalStyles.storeHeader}>
                <Image
                    source={{ uri: sellerContent.storepagePhoto ?  content.sellerContent.storepagePhoto : ''}}
                    style={GlobalStyles.storeImage}
                />
            
                <Text style={GlobalStyles.storeName}>
                {sellerContent.storepageName || 'Store Name'}
                </Text>
        
                <Text style={GlobalStyles.storeRating}>
                ⭐ {sellerContent.rating ?? '0.0'} / 5
                </Text>
        
                <Text style={GlobalStyles.storeBio}>
                {sellerContent.storepageBio || 'No store bio available.'}
                </Text>
            </View>
        
            {/* Store Items Section */}
            <View style={GlobalStyles.storeItemsSection}>
                <View style={GlobalStyles.storeItemsGrid}>
                {
                    sellerContent.products.map((product, index) => (
                    <TouchableOpacity
                        key={product.productID || index}
                        style={GlobalStyles.storeItemCard}
                        onPress={() => navigation.navigate('productInfo', { productID: product.productID })}
                    >
                        <Image
                        source={{ uri: product.productImage }}
                        style={GlobalStyles.storeItemImage}
                        />
                        <Text style={GlobalStyles.storeItemTitle}>{product.productName}</Text>
                        <Text style={GlobalStyles.storeItemPrice}>${product.productPrice}</Text>
                    </TouchableOpacity>
                    ))
                }
                </View>
            </View>
            </ScrollView>
        </>

      );
      
}