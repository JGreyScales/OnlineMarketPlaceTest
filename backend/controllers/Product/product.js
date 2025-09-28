const {Product} = require('./productController')

class ProductList {
    #products
    MIN_PRODUCT_PRICE = 0.00;
    MAX_PRODUCT_NAME_LENGTH = 20;
    MAX_PRODUCT_BIO_LENGTH = 1000;

    constructor(){}

    populateList(){}
    getProductList(){}
}


module.exports = { ProductList };