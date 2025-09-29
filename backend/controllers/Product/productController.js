class Product {
    #productID;
    #sellerID;
    #productImage;
    #productName;
    #productBio;
    #productRating;
    #updatedAt;
    #createdAt;
    #intestTags;
    MIN_PRODUCT_PRICE = 0.00;
    MAX_PRODUCT_NAME_LENGTH = 20;
    MAX_PRODUCT_BIO_LENGTH = 1000;

    constructor(){}
    populateObject(){}
    populatePreviewObject(){}
    inquireProductById(){}
    inquireProductsBySellerId(){}
    getProductID(){}
    getSellerID(){}
    getProductImage(){}
    getProductName(){}
    getProductBio(){}
    getProductRating(){}
    getUpdatedAt(){}
    getCreatedAt(){}
    getInterestTags(){}
}

module.exports = { Product };