import React, { useEffect, useState } from 'react';
import { Modal, TextInput, View, ActivityIndicator, TouchableOpacity, Text, Image, ScrollView, FlatList } from 'react-native';
import { CustomButton } from '../functions/CustomButton';
import { GlobalStyles, colors } from '../functions/globalStyleSheet';
import SessionStorage from 'react-native-session-storage';
import { useRoute } from '@react-navigation/native';


const MAX_INTERESTS = 5;


export default function SellerPOVProduct({ navigation }) {
    const [error, setError] = useState(null)
    const route = useRoute();
    // route.params.productID

    const [productName, setProductName] = useState('')
    const [productImage, setProductImage] = useState(null)
    const [productBio, setProductBio] = useState('')
    const [productPrice, setProductPrice] = useState('')
    const [productRating, setProductRating] = useState(0.00)
    const [productInterests, setProductInterests] = useState([])

    const [interestInput, setInterestInput] = useState('')
    const [interestSuggestions, setInterestSuggestions] = useState([])
    const [fetchingSuggestions, setFetchingSuggestions] = useState(false)

    const addInterest = (interest) => {
        // interest = interest.tag
        if (productInterests.length >= MAX_INTERESTS) return;
        if (productInterests.includes(interest)) return;
        setProductInterests((prev) => [...prev, interest]);
        setInterestInput('');
        setInterestSuggestions([]);
      };
    
      const removeInterest = (interest) => {
        setProductInterests((prev) => prev.filter((i) => i !== interest));
      };

    const getProductInfo = async () => {
        try {
            const sessionToken = await sessionStorage.getItem('@SessionKey')
            const response = await fetch(`http://localhost:3000/product/${route.params.productID}`, {
                method: 'GET',
                headers: {
                    Authorization: sessionToken
                }
            })

            if (!response.ok) {
                setError("error getting product")
                return
            }

            const data = (await response.json()).data
            setProductImage(data.productImage)
            setProductName(data.productName)
            setProductBio(data.productBio)
            setProductPrice(data.productPrice)
            setProductRating(data.productRating)
            setProductInterests(data.interests)
        } catch (error) {
            setError('Error fetching product info:' + error.message)
        }
    }

    useEffect(() => {

    }, [])

    return (
        <View style={GlobalStyles.container}>
            <CustomButton text="Back" onPress={() => navigation.goBack()} />
            <CustomButton text="Submit" onPress={() => { }} />

            {/* productName */}
            <TextInput
                style={GlobalStyles.input}
                placeholder='Products Name'
                value={productName}
                onChangeText={setProductName}
            />

            {/* productBio */}
            <TextInput
                style={[GlobalStyles.input, GlobalStyles.multilineInput]}
                placeholder='Product Bio'
                value={productBio}
                onChangeText={setProductBio}
                multiline={true}
            />

            {/* productPrice */}
            <TextInput
                style={GlobalStyles}
                placeholder='0'
                keyboardType='numeric'
                value={productPrice}
                onChangeText={(text) => {
                    if (text === '') {setProductPrice(0)}
                    else if (!isNaN(parseFloat(text)) && parseFloat(text) > 0.00) {setProductPrice(parseFloat(text))}}
                }
            />

            {/* productInterests */}
            <Text style={GlobalStyles.inputLabel}>Tags max {MAX_INTERESTS}</Text>
            <TextInput
                style={GlobalStyles.input}
                placeholder='Type to get suggestions'
                value={interestInput}
                onChangeText={setInterestInput}
                autoCapitalize='none'
                autoCorrect={false}
            />
            {fetchingSuggestions && <Text>Loading suggetsions...</Text>}
            {interestSuggestions.length > 0 && (
                <FlatList
                data={interestSuggestions}
                keyExtractor={(item) => item}
                style={GlobalStyles.suggestionList}
                keyboardShouldPersistTaps="handled"
                renderItem={({item}) => (
                    <TouchableOpacity style={GlobalStyles.suggestionItem} onPress={() => addInterest(item)}>
                        <Text>{item}</Text>
                    </TouchableOpacity>
                )}
                />
            )}

            <View>
                {productInterests.map((interest) => (
                    <View key={interest} style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text>{interest}</Text>
                        <TouchableOpacity onPress={() => removeInterest(interest)}>
                            <Text style={GlobalStyles.removeInterest}> ×</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
            {/* Other data */}

            {/* Product Rating */}

            {/* Product Image */}


        </View>
    )
}