import React, { useEffect, useState } from 'react';
import { Modal, TextInput, View, ActivityIndicator, TouchableOpacity, Text, Image, ScrollView, FlatList } from 'react-native';
import { CustomButton } from '../functions/CustomButton';
import { GlobalStyles, colors } from '../functions/globalStyleSheet';
import SessionStorage from 'react-native-session-storage';
import { useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message'


const MAX_INTERESTS = 5;
const MAX_PRODUCTNAME_LENGTH = 20;
const MAX_PRODUCTBIO_LENGTH = 1000;

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
            const sessionToken = await SessionStorage.getItem('@sessionKey');
            const response = await fetch(`http://localhost:3000/product/${route.params.ProductID}`, {
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

    const onSubmitProductInfo = async () => {
        try {
            const sessionToken = await SessionStorage.getItem('@sessionKey');
            const bodyData = {
                productName: productName,
                productImage: productImage,
                productBio: productBio,
                productPrice: productPrice,
                productInterests: productInterests
            }

            const response = await fetch(`http://localhost:3000/product/${route.params.ProductID}`, {
                method: 'PATCH',
                headers: {
                    Authorization: sessionToken,
                    'CONTENT-TYPE': 'application/json'
                },
                body: JSON.stringify(bodyData)
            })

            Toast.show({
                type: response.ok ? 'success' : 'error',
                text1: response.ok ? 'Product information updated' : 'Error updating product infromation'
            })

            getProductInfo()
        } catch (error) {
            setError('Error updating product info:' + error.message)
        }
    }

    useEffect(() => {
        if (interestInput.length === 0) {
            setInterestSuggestions([]);
            return;
        }

        const fetchSuggestions = async () => {
            setFetchingSuggestions(true);
            try {
                const sessionToken = await SessionStorage.getItem('@sessionKey');

                const response = await fetch(`http://localhost:3000/interest/AC/${interestInput}`, {
                    headers: {
                        Authorization: sessionToken,
                    },
                });
                if (response.ok) {
                    const interestList = [];
                    const suggestions = await response.json();
                    suggestions.data.forEach(element => {
                        if (!productInterests.includes(element.tag)) {
                            interestList.push(element.tag)
                        }
                    });
                    setInterestSuggestions(interestList);
                } else {
                    Toast.show({
                        type: 'error',
                        text1: 'Error fetching interest suggestions'
                    })
                    setInterestSuggestions([]);
                }
            } catch {
                setInterestSuggestions([]);
            } finally {
                setFetchingSuggestions(false);
            }
        };

        // Debounce fetch with a timeout
        const timeoutId = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(timeoutId);
    }, [interestInput, productInterests])

    useEffect(() => {
        getProductInfo()
    }, [])

    return (
        <View style={GlobalStyles.container}>
            <CustomButton text="Back" onPress={() => navigation.goBack()} />
            <CustomButton text="Submit" onPress={onSubmitProductInfo} />

            {/* productName */}
            <Text style={GlobalStyles.inputLabel}>Product Name</Text>
            <TextInput
                style={GlobalStyles.input}
                placeholder='Products Name'
                value={productName}
                onChangeText={setProductName}
                maxLength={MAX_PRODUCTNAME_LENGTH}
            />
            <Text style={GlobalStyles.charCount}>{productName.length} / {MAX_PRODUCTNAME_LENGTH}</Text>


            {/* productBio */}
            <Text style={GlobalStyles.inputLabel}>Product Bio</Text>
            <TextInput
                style={[GlobalStyles.input, GlobalStyles.multilineInput]}
                placeholder='Product Bio'
                value={productBio}
                onChangeText={setProductBio}
                multiline={true}
                maxLength={MAX_PRODUCTBIO_LENGTH}
            />
            <Text style={GlobalStyles.charCount}>{productBio.length} / {MAX_PRODUCTBIO_LENGTH}</Text>

            {/* productPrice */}
            <Text style={GlobalStyles.inputLabel}>Product Price</Text>
            <TextInput
                style={GlobalStyles.input}
                placeholder='0'
                keyboardType='numeric'
                value={productPrice}
                onChangeText={(text) => {
                    if (text === '') { setProductPrice(0) }
                    else if (!isNaN(parseFloat(text)) && parseFloat(text) > 0.00) { setProductPrice(parseFloat(text)) }
                }
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
            {fetchingSuggestions && <Text>Loading suggestions...</Text>}
            {interestSuggestions.length > 0 && (
                <FlatList
                    data={interestSuggestions}
                    keyExtractor={(item) => item}
                    style={GlobalStyles.suggestionList}
                    keyboardShouldPersistTaps="handled"
                    renderItem={({ item }) => (
                        <TouchableOpacity style={GlobalStyles.suggestionItem} onPress={() => addInterest(item)}>
                            <Text>{item}</Text>
                        </TouchableOpacity>
                    )}
                />
            )}

            <View>
                {productInterests.map((interest) => (
                    <View key={interest} style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text>{interest}</Text>
                        <TouchableOpacity onPress={() => removeInterest(interest)}>
                            <Text style={GlobalStyles.removeInterest}> ×</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>

            {/* Other data */}
            {/* Product Rating */}
            <Text style={GlobalStyles.inputLabel}>Product Rating</Text>
            <Text>⭐ {productRating}</Text>

            {/* Product Image */}
            <View style={GlobalStyles.profileContainer}>
                <Image source={{ uri: productImage ? productImage : undefined }} />
            </View>

        </View>
    )
}