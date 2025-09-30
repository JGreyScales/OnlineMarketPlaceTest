const connection = require("../../models/db")
const {Interest} = require("../interestController")

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
    MAX_PRODUCT_BIO_LENGTH = 1000;
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
            let query = "SELECT rating FROM Rating WHERE productID = ? LIMIT 200"
            connection.query(query, [this.#productID], (err, results) => {
                if (err) return reject(err);
                if (results.length === 0) return resolve(0);
                const totalRating = results.reduce((sum, rating) => sum + rating.rating, 0)
                this.#productRating = (totalRating / results.length).toFixed(1)
                resolve()
            })
        })
    }

    async populateInterestTags() {
        try {
            let query = "SELECT tagID FROM Interest_bridge WHERE productID = ?";
            const InterestOBJ = new Interest();
            const results = await new Promise((resolve, reject) => {
                connection.query(query, [this.#productID], (err, results) => {
                    if (err) return reject(err);
                    resolve(results);
                });
            });
    
            if (results.length === 0) {
                console.log('No tags found for this product.');
                return [];
            }
    
            const tagNames = await InterestOBJ.tagIDsToNames(results.map(tag => tag.tagID));
            this.#interestTags = tagNames;
            return tagNames;
        } catch (error) {
            console.error("Error populating interest tags:", error);
            throw error;  // Re-throw the error for the calling function to handle
        }
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