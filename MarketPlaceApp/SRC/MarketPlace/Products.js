import {FlatList, View, TouchableOpacity, Text, Image } from 'react-native';
import { GlobalStyles} from '../functions/globalStyleSheet';
import navigateNewPage from '../functions/NavigateNewScreen';
import SessionStorage from 'react-native-session-storage';
import { CustomButton } from '../functions/CustomButton';
import { useEffect, useState } from 'react';

export default function ProductsPage({navigation}) {
    const [error, setError] = useState(null);
    const [productsList, setProductsList] = useState([]);

    const grabWeightedProducts = async () => {
        try {
            const sessionToken = await SessionStorage.getItem('@sessionKey');
            // fetches 25 results from the weighted storepage
            const response = await fetch('http://localhost:3000/user/weightedStorePage/25', {
                method: 'GET',
                headers: {
                    Authorization: sessionToken
                }
            });

            if (!response.ok) {
                setError('Failed fetching products');
                return;
            }

            const data = (await response.json()).data;
            setProductsList(data);
        } catch (error) {
            setError('Error fetching products:' + error.message);
        }
    };

    useEffect(() => {
        grabWeightedProducts();
    }, []);
    
    const goToHomepage = () => {navigateNewPage('homepage', navigation)}


    if (error) {
        return (
            <View style={GlobalStyles.center}>
                <Text style={GlobalStyles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={GlobalStyles.container}>
            <CustomButton text="Back" onPress={goToHomepage} />
            <CustomButton text="Refresh" onPress={() => grabWeightedProducts()} />
            <FlatList
                data={productsList}
                keyExtractor={(item) => item.productID.toString()}
                numColumns={2}
                contentContainerStyle={GlobalStyles.productGridContainer}
                renderItem={({ item, index }) => (
                    <TouchableOpacity
                    style={[GlobalStyles.productCard, { flex: 1 }]}
                    onPress={() => navigation.navigate('productInfo', {productID: item.productID})}
                    >
                    <View style={GlobalStyles.productCardContent}>
                        <Image
                        source={{ uri: item.productImage }}
                        style={GlobalStyles.productImage}
                        />
                        <Text style={GlobalStyles.productTitle}>{item.productName}</Text>
                        <Text style={GlobalStyles.productPrice}>${parseFloat(item.productPrice).toFixed(2)}</Text>
                    </View>
                    </TouchableOpacity>
                )}
                />

        </View>
    );
}
