const connection = require("../../models/db")

class Product {
    #productID;
    #sellerID;
    #storepageName = '';
    #productImage;
    #productName;
    #productBio;
    #productPrice;
    #productRating = 0;
    #updatedAt;
    #createdAt;
    #interestTags = [];
    MIN_PRODUCT_PRICE = 0.00;
    MAX_PRODUCT_NAME_LENGTH = 20;
    MIN_PRODUCT_NAME_LENGTH = 3;
    MAX_PRODUCT_BIO_LENGTH = 1000;
    MIN_PRODUCT_BIO_LENGTH = 50;
    MIN_RATING_VALUE = 1;
    MAX_RATING_VALUE = 5;

    constructor(productID, sellerID, productImage, productName, productBio, productPrice, updatedAt, createdAt){
        this.#productID = productID
        this.#sellerID = sellerID
        this.#productImage = productImage
        this.#productName = productName
        this.#productBio = productBio
        this.#productPrice = productPrice
        this.#updatedAt = updatedAt
        this.#createdAt = createdAt
    }

    static getSellerID(productID) {
        return new Promise((resolve, reject) => {
            let query = "SELECT sellerID FROM Product WHERE productID = ?"
            connection.query(query, [parseInt(productID)], (err, results) => {
                if (err) return reject(0)
                if (results.length === 0) return reject(0)
                return resolve(parseInt(results[0].sellerID))
            })
        })

    }


    populateStorePageName(){
        return new Promise((resolve, reject) => {
            let query = "SELECT storepageName FROM Seller WHERE sellerID = ?"
            connection.query(query, [this.#sellerID], (err, results) => {
                if (err) return reject(err);
                if (results.length === 0) return resolve('');
                this.#storepageName = results[0].storepageName
                resolve();
            })
        })
    }

    populateProductRating(){
        return new Promise((resolve, reject) => {
            let query = "SELECT AVG(rating) as rating FROM Rating WHERE productID = ?"
            connection.query(query, [this.#productID], (err, results) => {
                if (err) return reject(err);
                if (results.length === 0) return resolve(0);
                console.log(results[0].rating)
                this.#productRating = (parseFloat(results[0].rating)).toFixed(1)
                resolve()
            })
        })
    }

    populateInterestTags(){
        return new Promise((resolve, reject) => {
            let query = " SELECT i.tag FROM Interest_bridge ib JOIN Interest i ON ib.tagID = i.tagID WHERE ib.productID = ?"
            connection.query(query, [this.#productID], (err, results) => {
                if (err) return reject(err);
                if (results.length === 0) return resolve([]);
                this.#interestTags = results.map(interest => interest.tag)
                resolve()
            })
        })
    }

    async populateAll(){
        try {
            await this.populateStorePageName();
            await this.populateProductRating();
            await this.populateInterestTags();
        } catch (error) {
            console.log(`Error populating fields: ${error}`);
        }
    }

    getProductID(){
        return this.#productID
    }

    getSellerID(){
        return this.#sellerID
    }

    getStorepageName(){
        return this.#storepageName
    }

    getProductImage(){
        return this.#productImage
    }

    getProductName(){
        return this.#productName
    }

    getProductBio(){
        return this.#productBio
    }

    getProductPrice(){
        return this.#productPrice
    }

    getProductRating(){
        return this.#productRating
    }

    getUpdatedAt(){
        return this.#updatedAt
    }

    getCreatedAt(){
        return this.#createdAt
    }

    getInterestTags(){
        return this.#interestTags
    }


}

module.exports = { Product };