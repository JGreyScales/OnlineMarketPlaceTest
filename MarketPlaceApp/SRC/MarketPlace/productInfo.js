import React, { useEffect, useState } from 'react';
import { Modal, TextInput, View, ActivityIndicator, TouchableOpacity, Text, Image, ScrollView } from 'react-native';
import { CustomButton } from '../functions/CustomButton';
import { useRoute } from '@react-navigation/native';
import { GlobalStyles, colors } from '../functions/globalStyleSheet';
import SessionStorage from 'react-native-session-storage';


export default function ProductInfo({navigation}) {
    const route = useRoute(); 
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const [purchaseModal, setPurchaseModal] = useState(false);
    const [reviewModal, setReviewModal] = useState(false);

    const [productContent, setProductContent] = useState(null)
    const [userWalletAmount, setUserWalletAmount] = useState(0.00);
    const [userRatingOfProduct, setUserRatingOfProduct] = useState(0);

    const grabUserWallet = async () => {
        try{
            const sessionToken = await SessionStorage.getItem('@sessionKey');
            const response = await fetch('http://localhost:3000/user/fund', {
                method: 'GET',
                headers: {
                    Authorization: sessionToken
                }
            })

            if (!response.ok) {
                setError('Failed fetching user wallet')
                return
            }
            const data = parseFloat((await response.json()).userFundsAmount).toFixed(2)
            setUserWalletAmount(data)

        } catch (error){
            setError('Fetch error:' + error.message);
        }
    }

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

    const onPurchase = async () => {
        try {
            setPurchaseModal(false)
            const sessionToken = await SessionStorage.getItem('@sessionKey');
            const response = fetch(`http://localhost:3000/product/${productContent.productID}/purchase`, {
                method: 'GET',
                headers: {
                    Authorization: sessionToken
                }
            })

            if (!response.ok){
                return;
            }
        } catch (error) {
            setError('Purchase Error:' + error.message)
        }
    }

    const onSubmit = async () => {
        try {
            setReviewModal(false)
            const sessionToken = await SessionStorage.getItem('@sessionKey')

            // if the content does not meet requirements
            if (isNaN(parseInt(userRatingOfProduct)) || parseInt(userRatingOfProduct) < 1 || parseInt(userRatingOfProduct) > 5){
                return;
            }
            const requestBody = {
                rating: parseInt(userRatingOfProduct)
            }

            const response = fetch(`http://localhost:3000/product/${productContent.productID}/rating`, {
                method: 'POST',
                headers : {
                    'CONTENT-TYPE': 'application/json',
                    Authorization: sessionToken
                },
                body: JSON.stringify(requestBody)
            })
            setUserRatingOfProduct(0)
            grabProductDetails()
        } catch (error) {
            setError('Error rating product:' + error.message)
        }
       
    }

    useEffect(() => {
        grabProductDetails()
        grabUserWallet()
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
        <>
            <View style={GlobalStyles.container}>
                <CustomButton text="Back" onPress={() => navigation.goBack()} />
                <CustomButton text="Purchase" onPress={() => setPurchaseModal(true)} />
                <CustomButton text="Review" onPress={() => setReviewModal(true)} />

                <ScrollView style={GlobalStyles.productDetailContainer}>
                <View style={GlobalStyles.productDetailImageContainer}>
                <Image
                    source={{ uri: productContent.productImage ? productContent.productImage : undefined }}
                    style={GlobalStyles.productDetailImage}
                />
                </View>
        
                <View style={GlobalStyles.productDetailInfo}>
                <Text style={GlobalStyles.productDetailTitle}>{productContent.productName}</Text>
                <TouchableOpacity onPress={() => navigation.navigate('sellerHomepage', {sellerID: productContent.sellerID})}>
                    <Text style={GlobalStyles.productDetailSeller}>Sold by: {productContent.storepageName}</Text>
                </TouchableOpacity>
                <Text style={GlobalStyles.productDetailPrice}>${parseFloat(productContent.productPrice).toFixed(2)}</Text>
                <Text style={GlobalStyles.productDetailRating}>⭐ {parseFloat(productContent.productRating).toFixed(1)}</Text>
        
                <Text style={GlobalStyles.productDetailDescription}>{productContent.productBio}</Text>
        
                <View style={{ marginTop: 20 }}>
                    <Text style={GlobalStyles.sectionTitle}>Tags</Text>
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


         {/* purchase Product Modal */}
         <Modal visible={purchaseModal} transparent animationType="slide">
          <View style={GlobalStyles.modalWrapper}>
            <View style={GlobalStyles.modalContainer}>
                <Text style={GlobalStyles.inputLabel}>Amount In Account:{userWalletAmount}</Text>
                <Text style={GlobalStyles.inputLabel}>Product Price:{parseFloat(productContent.productPrice).toFixed(2)}</Text>
                <TouchableOpacity
                    style={[GlobalStyles.button, GlobalStyles.modalButtonCancel]}
                    onPress={() => {setPurchaseModal(false)}}
                >
                    <Text style={GlobalStyles.modalButtonTextCancel}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[GlobalStyles.button, GlobalStyles.modalButtonSave]}
                    onPress={onPurchase}
                >
                    <Text style={GlobalStyles.buttonText}>Purchase</Text>
                </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Rate Product Modal */}
        <Modal visible={reviewModal} transparent animationType="slide">
          <View style={GlobalStyles.modalWrapper}>
            <View style={GlobalStyles.modalContainer}>
            <Text style={GlobalStyles.inputLabel}>Enter Your Rating 1-5</Text>
                <TextInput
                    style={GlobalStyles.input}
                    keyboardType="numeric"
                    value={userRatingOfProduct}
                    onChangeText={(text) => {
                        const decimalText = text.replace(/[^0-9.]/g, '');
                        setUserRatingOfProduct(decimalText);
                    }}
                    placeholder="Enter Rating 1-5"
                    />
                <TouchableOpacity
                    style={[GlobalStyles.button, GlobalStyles.modalButtonCancel]}
                    onPress={() => {setReviewModal(false); setUserRatingOfProduct(0)}}
                >
                    <Text style={GlobalStyles.modalButtonTextCancel}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[GlobalStyles.button, GlobalStyles.modalButtonSave]}
                    onPress={onSubmit}
                >
                    <Text style={GlobalStyles.buttonText}>Submit</Text>
                </TouchableOpacity>
            </View>
          </View>
        </Modal>


      </>
    );
}
