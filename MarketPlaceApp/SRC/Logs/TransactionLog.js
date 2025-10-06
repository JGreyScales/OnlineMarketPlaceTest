import { Modal, FlatList, TextInput, View, TouchableOpacity, Text } from 'react-native';
import { GlobalStyles, colors } from '../functions/globalStyleSheet';
import navigateNewPage from '../functions/NavigateNewScreen';
import SessionStorage from 'react-native-session-storage';
import { CustomButton } from '../functions/CustomButton';
import { useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';


export default function TransactionLog({navigation}){
    const route = useRoute()
    const [error, setError] = useState(null)

    const [transactionsList, setTransactionsList] = useState([])
    const [sellerView, setSellerView] = useState((route.params && route.params.sellerID) ? true : false)

    // modals
    const [showSellerModal, setShowSellerModal] = useState(false)
    const [showProductModal, setShowProductModal] = useState(false)
    const [showTransactionModal, setShowTransactionModal] = useState(false)

    const [uniqueSellers, setUniqueSellers] = useState([])
    const [uniqueProducts, setUniqueProducts] = useState([])
    const [uniqueTransactions, setUniqueTransactions] = useState([])

    // filters
    const [selectedSellerID, setSelectedSellerID] = useState(0)
    const [selectedProductID, setSelectedProductID] = useState(0)
    const [selectedTransactionID, setSelectedTransactionID] = useState(0)

    const grabTransactionsWithFilter = async () => {
      try {
        const sessionToken = await SessionStorage.getItem('@sessionKey');
        const requestBody = {
          sellerMode : sellerView
        }
        
        if (selectedSellerID > 0) {requestBody.sellerID = selectedSellerID}
        if (selectedProductID > 0) {requestBody.productID = selectedProductID}
        if (selectedTransactionID > 0) {requestBody.transactionID = selectedTransactionID}

        const response = await fetch('http://localhost:3000/transaction/transactionList', {
          method: 'POST',
          headers: {Authorization: sessionToken, 'Content-Type': 'application/json'},
          body: JSON.stringify(requestBody)
        })

        if (!response.ok) {
          if (response.status === 404) {
            setTransactionsList([]);
          } else {
            setError('Error fetching transactions #2');
          }
          return;
        }
        

        const data = await response.json()
        setTransactionsList(data)

        const uniqueSellersMap = new Map();
        const uniqueProductsMap = new Map();
        data.forEach(item => {
          if (!uniqueSellersMap.has(item.sellerID)) {
            uniqueSellersMap.set(item.sellerID, { 
              sellerID: item.sellerID, 
              sellerName: item.sellerName 
            });
          }

          if (!uniqueProductsMap.has(item.productID)) {
            uniqueProductsMap.set(item.productID, {
              productID: item.productID,
              productName: item.productName
            })
          }
        });

        setUniqueSellers(Array.from(uniqueSellersMap.values()))
        setUniqueProducts(Array.from(uniqueProductsMap.values()))
        setUniqueTransactions([...new Set(data.map(item => item.ID))])

      } catch (error){
        setError('Error fetching transactions #1')
      }
    }

    const goToHomepage = () => {navigateNewPage('homepage', navigation)}

    useEffect(() => {
      grabTransactionsWithFilter();
    }, [selectedSellerID, selectedProductID, selectedTransactionID]);    

    if (error) {
      return (
        <View style={GlobalStyles.center}>
          <Text style={GlobalStyles.errorText}>{error}</Text>
        </View>
      );
    }

    
    return (
        <>
        <View style={{ padding: 16 }}>
            {/* Back Button */}
            <CustomButton text="Back" onPress={goToHomepage} />

            <View>
              <TouchableOpacity
                onPress={() => setShowSellerModal(true)}
                style={[
                  GlobalStyles.button,
                  selectedSellerID !== 0 && { backgroundColor: 'green' }
                ]}
              >
                <Text style={GlobalStyles.buttonText}>Seller ID</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setShowProductModal(true)}
                style={[
                  GlobalStyles.button,
                  selectedProductID !== 0 && { backgroundColor: 'green' }
                ]}
              >
                <Text style={GlobalStyles.buttonText}>Product ID</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setShowTransactionModal(true)}
                style={[
                  GlobalStyles.button,
                  selectedTransactionID !== 0 && { backgroundColor: 'green' }
                ]}
              >
                <Text style={GlobalStyles.buttonText}>Transaction ID</Text>
              </TouchableOpacity>
            </View>

      
          {/* Transaction List */}
          <FlatList
            data={transactionsList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={GlobalStyles.transactionLogItem}>
                <View style={GlobalStyles.transactionTextGroup}>
                  <Text style={GlobalStyles.transactionSeller}>{sellerView ? `Buyer: ${item.buyerID}` : `Seller: ${item.sellerName}`}</Text>
                  <Text style={GlobalStyles.transactionProduct}>Product: {item.productName}</Text>
                  <Text style={GlobalStyles.transactionDate}>ID {item.ID} on {item.date}</Text>
                </View>
                <Text style={GlobalStyles.transactionPrice}>${item.priceAmount}</Text>
              </View>
            )}
          />
      

        </View>
      
        {/* Seller Modal */}
        <Modal visible={showSellerModal} transparent animationType="slide">
          <View style={GlobalStyles.modalWrapper}>
            <View style={GlobalStyles.modalContainer}>
                <TouchableOpacity style={[GlobalStyles.button, GlobalStyles.modalButtonCancel]}onPress={() => {setShowSellerModal(false); setSelectedSellerID(0)}}>
                    <Text style={GlobalStyles.modalButtonTextCancel}>Cancel</Text>
                </TouchableOpacity>

              <Text style={GlobalStyles.modalTitle}>Select Seller ID</Text>
              <FlatList
                data={uniqueSellers}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[GlobalStyles.suggestionItem, {alignItems: 'center'}]}
                    onPress={() => {
                      setSelectedSellerID(item.sellerID);
                      setShowSellerModal(false);
                    }}
                  >
                    <Text>{item.sellerName}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>
      
        {/* Product Modal */}
        <Modal visible={showProductModal} transparent animationType="slide">
          <View style={GlobalStyles.modalWrapper}>
            <View style={GlobalStyles.modalContainer}>
                <TouchableOpacity style={[GlobalStyles.button, GlobalStyles.modalButtonCancel]} onPress={() => {setShowProductModal(false); setSelectedProductID(0)}}>
                    <Text style={GlobalStyles.modalButtonTextCancel}>Cancel</Text>
                </TouchableOpacity>


                <Text style={GlobalStyles.modalTitle}>Select Product ID</Text>
                <FlatList
                    data={uniqueProducts}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[GlobalStyles.suggestionItem, {alignItems: 'center'}]}
                        onPress={() => {
                        setSelectedProductID(item.productID);
                        setShowProductModal(false);
                        }}
                    >
                        <Text>{item.productName}</Text>
                    </TouchableOpacity>
                    )}
                />
            </View>
          </View>
        </Modal>
      
        {/* Transaction Modal */}
        <Modal visible={showTransactionModal} transparent animationType="slide">
          <View style={GlobalStyles.modalWrapper}>
            <View style={GlobalStyles.modalContainer}>
                <TouchableOpacity style={[GlobalStyles.button, GlobalStyles.modalButtonCancel]}onPress={() => {setShowTransactionModal(false); setSelectedTransactionID(0)}}>
                    <Text style={GlobalStyles.modalButtonTextCancel}>Cancel</Text>
                </TouchableOpacity>

              <Text style={GlobalStyles.modalTitle}>Select Transaction ID</Text>
              <FlatList
                data={uniqueTransactions}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[GlobalStyles.suggestionItem, {alignItems: 'center'}]}
                    onPress={() => {
                      setSelectedTransactionID(item);
                      setShowTransactionModal(false);
                    }}
                  >
                    <Text>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>
      </>      
    )
}