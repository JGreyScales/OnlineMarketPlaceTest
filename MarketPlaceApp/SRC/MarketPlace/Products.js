import { Modal, FlatList, TextInput, View, TouchableOpacity, Text } from 'react-native';
import { GlobalStyles, colors } from '../functions/globalStyleSheet';
import navigateNewPage from '../functions/NavigateNewScreen';
import SessionStorage from 'react-native-session-storage';
import { CustomButton } from '../functions/CustomButton';
import { useEffect, useState } from 'react';

export default function ProductsPage(){

    const grabWeightedProducts = () => {

    }

    useEffect(() => {
        grabWeightedProducts()
    }, [])

    const goToHomepage = () => {navigateNewPage('homepage', navigation)}

    return (
    <>
        <View>
            <CustomButton text="Back" onPress={goToHomepage} />
            {/* a grid of products, each product has ProductImage, Product Name, Price, the entire product object should be clickable */}
        </View>
    </>
    )
}