import { Modal, FlatList, TextInput, View, TouchableOpacity, Text } from 'react-native';
import { GlobalStyles, colors } from '../functions/globalStyleSheet';
import navigateNewPage from '../functions/NavigateNewScreen';
import SessionStorage from 'react-native-session-storage';
import { CustomButton } from '../functions/CustomButton';
import { useEffect, useState } from 'react';

export default function ProductsPage(){
    const [error, setError] = useState(null);

    const [productsList, setProductsList] = useState([])

    const grabWeightedProducts = async () => {
        try {
            const sessionToken = await SessionStorage.getItem('@sessionKey');
            // fetches 25 results from the weighted storepage
            const response = await fetch('http://localhost:3000/user/weightedStorePage/25',{
                method: 'GET',
                headers: {
                    Authorization: sessionToken
                }
            })

            if (!response.ok){setError('Failed fetching products'); return}
            const data = await response.json();
            
        } catch (error) {
            setError('Error fetching products:' + error.message)
        }
    }

    useEffect(() => {
        grabWeightedProducts()
    }, [])

    const goToHomepage = () => {navigateNewPage('homepage', navigation)}


    if (error)

    return (
    <>
        <View>
            <CustomButton text="Back" onPress={goToHomepage} />
            {/* a grid of products, each product has ProductImage, Product Name, Price, the entire product object should be clickable */}
        </View>
    </>
    )
}