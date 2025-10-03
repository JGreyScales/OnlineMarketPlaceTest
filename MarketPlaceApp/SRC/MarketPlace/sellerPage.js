import React, { useEffect, useState } from 'react';
import { Modal, TextInput, View, ActivityIndicator, TouchableOpacity, Text, Image, ScrollView } from 'react-native';
import { CustomButton } from '../functions/CustomButton';
import { useRoute } from '@react-navigation/native';
import { GlobalStyles, colors } from '../functions/globalStyleSheet';
import SessionStorage from 'react-native-session-storage';

export default function SellerPage({navigation}){
    const route = useRoute();
    const [error, setError] = useState(null)
    const [sellerID, setSellerID] = useState(route.params.sellerID)

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
                    sellerContent.rating = 0.0
                } else {
                    setError('Unable to retrieve seller rating');
                }
                return;
            }

            const data = parseFloat((await response.json()).rating).toFixed(1)
            sellerContent.rating = data
        } catch (error) {
            setError('Fetch rating error:' + error.message)
        }
    }

    const grabSellerInfo = async () => {

    }

    const grabSellerProducts = async () => {

    }

    useEffect(() => {
        grabSellerInfo()
        grabSellerRating()
        grabSellerProducts()
    }, [route.params])

    if (error) {
        return (
            <View style={GlobalStyles.center}>
                <Text style={GlobalStyles.errorText}>{error}</Text>
            </View>
        );
    }

    return (<View>
        
    </View>)
}