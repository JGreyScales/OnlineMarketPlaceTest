import React, { useEffect, useState } from 'react';
import { Modal, TextInput, View, ActivityIndicator, TouchableOpacity, Text, Image, ScrollView, FlatList } from 'react-native';
import { CustomButton } from '../functions/CustomButton';
import { GlobalStyles, colors } from '../functions/globalStyleSheet';
import SessionStorage from 'react-native-session-storage';

const MAX_STOREPAGENAME_LENGTH = 25;
const MAX_STOREPAGEBIO_LENGTH = 500;

const MAX_PRODUCTNAME_LENGTH = 20;
const MAX_PRODUCTBIO_LENGTH = 1000;

export default function SellerPOVHomepage({ navigation }) {
  const [loadingSeller, setLoadingSeller] = useState(true)
  const [loadingInterests, setLoadingInterests] = useState(true)
  const [loadingProducts, setLoadingProducts] = useState(true)

  const [error, setError] = useState(null);

  const sellerID = 'home'
  const [userIsSeller, setUserIsSeller] = useState(false)
  const [sellerBio, setSellerBio] = useState('')
  const [sellerName, setSellerName] = useState('')
  const [sellerPhoto, setSellerPhoto] = useState(null)
  const [sellerInterests, setSellerInterests] = useState([])
  const [sellerProducts, setSellerProducts] = useState([])

  const [showUpdateProfile, setShowUpdateProfile] = useState(false)
  const [showCreateProduct, setShowCreateProduct] = useState(false)

  const [productDetails, setProductDetails] = useState({ productName: '', productImage: null, productBio: '', productPrice: 0.00 })


  const getSellerDetails = async () => {
    try {
      const sessionToken = await SessionStorage.getItem('@sessionKey');
      const response = await fetch(`http://localhost:3000/seller/${sellerID}`, {
        method: 'GET',
        headers: {
          Authorization: sessionToken
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          setUserIsSeller(false);
        } else {
          setError('Error gathering seller details');
        }
        setLoadingSeller(false);
        return;
      }

      const data = await response.json();

      setSellerBio(data.storepageBio)
      setSellerName(data.storepageName)
      setSellerPhoto(data.storepagePhoto)

      setUserIsSeller(true);
      setLoadingSeller(false);
    } catch (error) {
      setError('Error fetching seller details: ' + error.message);
      setLoadingSeller(false);
    }
  };

  const getSellerInterests = async () => {
    try {
      const sessionToken = await SessionStorage.getItem('@sessionKey');
      const response = await fetch(`http://localhost:3000/seller/${sellerID}/interests`, {
        method: 'GET',
        headers: {
          Authorization: sessionToken
        }
      });

      if (!response.ok) {
        setError('Error gathering seller interests');
        setLoadingInterests(false);
        return;
      }

      const data = (await response.json()).data;
      const tags = data.map(interest => interest.tag);

      setSellerInterests(tags)

      setLoadingInterests(false);
    } catch (error) {
      setError('Error fetching seller interests: ' + error.message);
      setLoadingInterests(false);
    }
  };

  const getSellerProducts = async () => {
    try {
      const sessionToken = await SessionStorage.getItem('@sessionKey');
      const response = await fetch(`http://localhost:3000/seller/${sellerID}/products/999`, {
        method: 'GET',
        headers: {
          Authorization: sessionToken
        }
      });

      if (!response.ok) {
        setError('Error loading products');
        setLoadingProducts(false);
        return;
      }

      const data = (await response.json()).data;

      setSellerProducts(data)

      setLoadingProducts(false);
    } catch (error) {
      setError('Error fetching seller products: ' + error.message);
      setLoadingProducts(false);
    }
  };


  const onUpdateProfile = async () => {
    try {
      const sessionToken = await SessionStorage.getItem('@sessionKey');
      const updateBody = {
        storepageBio: sellerBio,
        storepagePhoto: sellerPhoto,
        storepageName: sellerName
      }

      const response = await fetch(`http://localhost:3000/seller`, {
        method: 'PATCH',
        headers: {
          Authorization: sessionToken,
          'CONTENT-TYPE': 'application/json'
        },
        body: JSON.stringify(updateBody)
      })

      setShowUpdateProfile(false)
      getSellerDetails()
    }
    catch (error) {
      setError('Cannot save profile, error:' + error.message)
    }
  }

  const onCreateproduct = async () => {
    try {
      const sessionToken = await SessionStorage.getItem('@sessionKey');
      productDetails.productPrice = productDetails.productPrice * 1.03
      // adds the platform tax to the product, so the seller just types the price they want to recieve per purchase
      // and the 0.03 goes to our wallet
      const response = await fetch(`http://localhost:3000/product`, {
        method: 'PUT',
        headers: {
          Authorization: sessionToken,
          'CONTENT-TYPE': 'application/json'
        },
        body: JSON.stringify(productDetails)
      })

      setShowCreateProduct(false)
      setProductDetails({ productName: '', productImage: null, productBio: '', productPrice: 0.00 })
      await getSellerProducts()
    } catch (error) {
      setError('Error creating product:' + error.message)
    }
  }

  const onRegisterNewSeller = async () => {
    try {
      const sessionToken = await SessionStorage.getItem('@sessionKey');
      const response = await fetch('http://localhost:3000/seller', {
        method: 'PUT',
        headers: {
          Authorization: sessionToken
        }
      })

      if (response.ok) {
        getSellerDetails()
        setUserIsSeller(true)
      }


    } catch (error) {
      setError('Error creating seller:' + error.message)
    }
  }

  useEffect(() => {
    getSellerDetails()
    getSellerInterests()
    getSellerProducts()
  }, [])



  if (loadingInterests || loadingProducts || loadingSeller) {
    <ActivityIndicator size="large" color={colors.primary} />
  }

  if (error) {
    <Text style={GlobalStyles.errorText}>{error}</Text>
  }

  if (!userIsSeller) {
    <View style={GlobalStyles.container}>
      <CustomButton text="Back" onPress={() => navigation.goBack()} />
      <Text syle={GlobalStyles.title}>Register as a seller?</Text>

      <TouchableOpacity style={GlobalStyles.button} onPress={onRegisterNewSeller}>
        <Text style={GlobalStyles.buttonText}>Yes</Text>
      </TouchableOpacity>

    </View>
  }

  return (
    <View style={{ padding: 16, flex: 1 }}>
      <CustomButton text="Back" onPress={() => navigation.goBack()} />
      <CustomButton text="Transactions" onPress={() => navigation.navigate('transaction', {sellerID: sellerID})} />
      {/* Store Header */}
      <View style={GlobalStyles.storeHeader}>
        <Image
          source={{ uri: sellerPhoto || '' }}
          style={GlobalStyles.storeImage}
        />
        <Text style={GlobalStyles.storeName}>
          {sellerName}
        </Text>
        <Text style={GlobalStyles.storeBio}>
          {sellerBio}
        </Text>
      </View>

      {/* Interests Horizontal Scroll Banner */}
      {sellerInterests && (
        <View style={{ marginBottom: 20 }}>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 10 }}
          >
            {sellerInterests.map((interest, index) => (
              <View key={index} style={[GlobalStyles.interestChip, { marginRight: 8 }]}>
                <Text style={GlobalStyles.interestText}>{interest}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}


      <CustomButton text="Update Profile" onPress={() => { setShowUpdateProfile(true) }} />
      <CustomButton text="Create Product" onPress={() => { setShowCreateProduct(true) }} />


      {/* product list */}
      <FlatList
        data={sellerProducts}
        keyExtractor={(product, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => { navigation.navigate('SellerPOVProduct', { ProductID: item.productID }) }}>
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


      {/* Update profile modal */}
      <Modal visible={showUpdateProfile} transparent animationType='slide'>
        <View style={GlobalStyles.modalContainer}>
          <Text style={GlobalStyles.modalTitle}>Update Storepage</Text>
          <Text style={GlobalStyles.inputLabel}>Storepage Name</Text>
          <TextInput
            style={GlobalStyles.input}
            placeholder='Storepage Name'
            value={sellerName}
            onChangeText={(text) => {
              if (text.length <= MAX_STOREPAGENAME_LENGTH) { setSellerName(text) }
            }}
            maxLength={MAX_STOREPAGENAME_LENGTH} />
          <Text style={GlobalStyles.charCount}>{sellerName.length || 0} / {MAX_STOREPAGENAME_LENGTH}</Text>


          <Text style={GlobalStyles.inputLabel}>Storepage Bio</Text>
          <TextInput
            style={[GlobalStyles.input, GlobalStyles.multilineInput]}
            placeholder='Storepage Bio'
            value={sellerBio}
            onChangeText={(text) => {
              if (text.length <= MAX_STOREPAGEBIO_LENGTH) { setSellerBio(text) }
            }}
            multiline={true}
            maxLength={MAX_STOREPAGEBIO_LENGTH}
          />
          <Text style={GlobalStyles.charCount}>{sellerBio.length || 0} / {MAX_STOREPAGEBIO_LENGTH}</Text>

          <TouchableOpacity
            style={[GlobalStyles.button, GlobalStyles.modalButtonCancel]}
            onPress={() => setShowUpdateProfile(false)}>
            <Text style={GlobalStyles.modalButtonTextCancel}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[GlobalStyles.button, GlobalStyles.modalButtonSave]}
            onPress={onUpdateProfile}>
            <Text style={GlobalStyles.buttonText}>save</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/*  create product modal */}
      <Modal visible={showCreateProduct} transparent animationType='slide'>
        <View style={GlobalStyles.modalContainer}>
          <Text style={GlobalStyles.modalTitle}>Create Product</Text>
          <Text style={GlobalStyles.inputLabel}>Product Name</Text>
          <TextInput
            style={GlobalStyles.input}
            placeholder='Product Name'
            value={productDetails.productName}
            onChangeText={(text) => {
              if (text.length <= MAX_PRODUCTNAME_LENGTH) { setProductDetails(prev => ({ ...prev, productName: text })) }
            }}
            maxLength={MAX_PRODUCTNAME_LENGTH}
          />
          <Text style={GlobalStyles.charCount}>{productDetails.productName.length} / {MAX_PRODUCTNAME_LENGTH}</Text>

          <Text style={GlobalStyles.inputLabel}>Product Bio</Text>
          <TextInput
            style={[GlobalStyles.input, GlobalStyles.multilineInput]}
            placeholder='Product bio'
            value={productDetails.productBio}
            onChangeText={(text) => {
              if (text.length <= MAX_PRODUCTBIO_LENGTH) { setProductDetails(prev => ({ ...prev, productBio: text })) }
            }}
            multiline={true}
            maxLength={MAX_PRODUCTBIO_LENGTH}
          />
          <Text style={GlobalStyles.charCount}>{productDetails.productBio.length} / {MAX_PRODUCTBIO_LENGTH}</Text>

          <Text style={GlobalStyles.inputLabel}>Product Price</Text>
          <TextInput
            style={GlobalStyles.input}
            placeholder='Product Price'
            keyboardType='numeric'
            value={productDetails.productPrice}
            onChangeText={(text) => {
              if (text === '') {
                setProductDetails(prev => ({ ...prev, productPrice: 0 }))
              }
              else if ((!isNaN(parseFloat(text)) && parseFloat(text) > 0.00)) {
                setProductDetails(prev => ({ ...prev, productPrice: parseFloat(text) }))
              }
            }}
          />

          <TouchableOpacity
            style={[GlobalStyles.button, GlobalStyles.modalButtonCancel]}
            onPress={() => { setShowCreateProduct(false); setProductDetails({ productName: '', productImage: null, productBio: '', productPrice: 0.00 }) }}
          >
            <Text style={GlobalStyles.modalButtonTextCancel}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={GlobalStyles.button}
            onPress={onCreateproduct}
          >
            <Text style={GlobalStyles.buttonText}>save</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  )

}