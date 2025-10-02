import { Modal, ScrollView, TextInput, View, TouchableOpacity, Text } from 'react-native';
import { GlobalStyles, colors } from '../functions/globalStyleSheet';
import navigateNewPage from '../functions/NavigateNewScreen';
import SessionStorage from 'react-native-session-storage';
import { CustomButton } from '../functions/CustomButton';
import { useEffect, useState } from 'react';


export default function FundControlPage({navigation}){
    const [error, setError] = useState(null);


    const [fundAmount, setFundAmount] = useState(0);
    const [addFundAmount, setAddFundAmount] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [withdrawing, setWithdrawing] = useState(false);



    const openModal = () => {
        setAddFundAmount(0);
        setWithdrawing(false);
        setModalVisible(true);
    }

    const withdrawModal = () => {
        setAddFundAmount(0);
        setWithdrawing(true);
        setModalVisible(true);
    }

    const fetchUserFunds = async () => {
        try{
            const sessionToken = await SessionStorage.getItem('@sessionKey');
            const response = await fetch('http://localhost:3000/user/fund', {method: 'GET', headers: {Authorization: sessionToken}})
            if (!response.ok){setError('Failed to fetch user funds')}
            const data = await response.json()
            setFundAmount(data.userFundsAmount)
        } catch (error){
            setError('Fetch error:' + error.message)
        }
    }

    const onSave = async () => {
        setModalVisible(false);
    
        const numericAmount = parseFloat(addFundAmount);
        if (isNaN(numericAmount) || numericAmount < 0.01) {
            setWithdrawing(false);
            return; // Stop if invalid input
        }

        if (withdrawing && parseFloat(fundAmount) < numericAmount){
            setWithdrawing(false);
            return; // trying to withdraw funds that dont exist
        } 
        const adjustedAmount = withdrawing ? numericAmount * -1 : numericAmount;
    
        try {
            const sessionToken = await SessionStorage.getItem('@sessionKey');
            await fetch('http://localhost:3000/user/fund', {
                method: 'PATCH',
                headers: {
                    Authorization: sessionToken,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fundsAmount: adjustedAmount }),
            });
    
            fetchUserFunds();
        } catch (error) {
            setError('Error updating wallet')
        } finally {
            setAddFundAmount(0);
            setWithdrawing(false);
        }
    };
    
    
    const goToHomepage = () => {navigateNewPage('homepage', navigation)}

    useEffect(() => {
        fetchUserFunds();
    }, []);

    if (error) {
        return (
          <View style={GlobalStyles.center}>
            <Text style={GlobalStyles.errorText}>{error}</Text>
          </View>
        );
      }

    return (
    <>
        <ScrollView contentContainerStyle={GlobalStyles.container}>
            {/* Add funds option */}
            <View style={GlobalStyles.container}>
                <View style={GlobalStyles.buttonContainer}> 
                    <Text style={GlobalStyles.userName}>Current Funds: ${fundAmount}</Text>
                    <CustomButton text="Add Funds" onPress={openModal}/>
                    <CustomButton text="Withdraw Funds" onPress={() => withdrawModal()}/>
                    <CustomButton text="Back" onPress={() => goToHomepage()}/>
                </View>
            </View>
        </ScrollView>

        <Modal animationType='slide' transparent={true} visible={modalVisible} onRequestClose={() => {setModalVisible(false); setWithdrawing(false)}}>
            <View style={GlobalStyles.modalContainer}>
                <Text style={GlobalStyles.inputLabel}>Amount to {withdrawing ? 'withdraw' : 'add'}</Text>
                <TextInput
                    style={GlobalStyles.input}
                    keyboardType="numeric"
                    value={addFundAmount}
                    onChangeText={(text) => {
                        const decimalText = text.replace(/[^0-9.]/g, '');
                        setAddFundAmount(decimalText);
                    }}
                    placeholder="Enter amount"
                    />
                <TouchableOpacity
                    style={[GlobalStyles.button, GlobalStyles.modalButtonCancel]}
                    onPress={() => {setModalVisible(false); setAddFundAmount(0)}}
                >
                    <Text style={GlobalStyles.modalButtonTextCancel}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[GlobalStyles.button, GlobalStyles.modalButtonSave]}
                    onPress={onSave}
                >
                    <Text style={GlobalStyles.buttonText}>Save</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    </>
)}