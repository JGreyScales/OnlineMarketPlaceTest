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

    const openModal = () => {
        setAddFundAmount(0);
        setModalVisible(true);
    }

    const onSave = async () => {
        setModalVisible(false)
        if (addFundAmount < 1 || isNaN(parseFloat(addFundAmount))){return}
        try{
            const sessionToken = await SessionStorage.getItem('@sessionKey');
            await fetch('http://localhost:3000/user/fund', {method: 'PATCH', headers: {Authorization: sessionToken, 'Content-Type': 'application/json'}, body: JSON.stringify({fundsAmount: addFundAmount})})
            setFundAmount(addFundAmount + fundAmount)
        } catch (error){

        } finally {
            setAddFundAmount(0);
        }
    }
    
    const goToHomepage = () => {navigateNewPage('homepage', navigation)}

    useEffect(() => {
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

        fetchUserFunds();
    }, [fundAmount])

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
                    <CustomButton text="Back" onPress={() => goToHomepage()}/>
                </View>
            </View>
        </ScrollView>

        <Modal animationType='slide' transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
            <View style={GlobalStyles.modalContainer}>
                <Text style={GlobalStyles.inputLabel}>Amount To Add</Text>
                <TextInput style={GlobalStyles.input} value={addFundAmount} keyboardType='numeric' onChangeText={setAddFundAmount}/>
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