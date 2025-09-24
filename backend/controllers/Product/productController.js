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