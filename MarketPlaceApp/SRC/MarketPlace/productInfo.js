import React, { useEffect, useState } from 'react';
import { Modal, FlatList, TextInput, View, ActivityIndicator, TouchableOpacity, Text, Image, ScrollView } from 'react-native';
import { CustomButton } from '../functions/CustomButton';
import { useRoute } from '@react-navigation/native';
import { GlobalStyles, colors } from '../functions/globalStyleSheet';
import SessionStorage from 'react-native-session-storage';


export default function ProductInfo({navigation}) {
    const route = useRoute(); 
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const [productContent, setProductContent] = useState(null)

    const grabProductDetails = async () => {
        try{
            const sessionToken = await SessionStorage.getItem('@sessionKey');
            const response = await fetch(`http://localhost:3000/product/${route.params.productID}`,{
                method: 'GET',
                headers: {
                    Authorization: sessionToken
                }
            })
    
            if (!response.ok) {
                setError('Failed fetching product')
                return
            }
    
            const data = (await response.json()).data
            setProductContent(data)
            setLoading(false);
        } catch (error) {
            setError('Fetch error:' + error.message);
        }
       
    }

    useEffect(() => {
        grabProductDetails()
    }, [route.params]);

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
        <View style={GlobalStyles.container}>
            <CustomButton text="Back" onPress={() => navigation.goBack()} />
            <CustomButton text="Purchase" onPress={1} />
            <CustomButton text="Review" onPress={1} />

            <ScrollView style={GlobalStyles.productDetailContainer}>
            <View style={GlobalStyles.productDetailImageContainer}>
            <Image
                source={{ uri: productContent.productImage ? `data:image/png;base64,${productContent.productImage}` : undefined }}
                style={GlobalStyles.productDetailImage}
            />
            </View>
    
            <View style={GlobalStyles.productDetailInfo}>
            <Text style={GlobalStyles.productDetailTitle}>{productContent.productName}</Text>
            <Text style={GlobalStyles.productDetailSeller}>Sold by: {productContent.storepageName}</Text>
            <Text style={GlobalStyles.productDetailPrice}>${parseFloat(productContent.productPrice).toFixed(2)}</Text>
            <Text style={GlobalStyles.productDetailRating}>⭐ {parseFloat(productContent.productRating).toFixed(1)}</Text>
    
            <Text style={GlobalStyles.productDetailDescription}>{productContent.productBio}</Text>
    
            <View style={{ marginTop: 20 }}>
                <Text style={GlobalStyles.sectionTitle}>Interests</Text>
                <View style={GlobalStyles.interestsList}>
                {productContent.interests.map((interest, idx) => (
                    <View key={idx} style={GlobalStyles.interestChip}>
                    <Text style={GlobalStyles.interestText}>{interest}</Text>
                    </View>
                ))}
                </View>
            </View>
    
            <Text style={{ marginTop: 20, fontSize: 12, color: '#999' }}>
                Created: {new Date(productContent.createdAT).toLocaleDateString()}
            </Text>
            <Text style={{ fontSize: 12, color: '#999' }}>
                Updated: {new Date(productContent.updatedAT).toLocaleDateString()}
            </Text>
            </View>
        </ScrollView>
      </View>
    );
}
