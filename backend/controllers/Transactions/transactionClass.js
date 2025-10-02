const connection = require("../../models/db")

class Transaction {
    #transactionID
    #userID
    #sellerID
    #productID
    #priceAmount
    #date
    #productName = ""
    #sellerName = ""
    #userName = ""
    MAX_TRANSACTION_NAME_LENGTH = 20;

    constructor(userID, sellerID, productID, priceAmount, date, transactionID = null){
        this.#transactionID = transactionID
        this.#userID = userID
        this.#sellerID = sellerID
        this.#productID = productID
        this.#priceAmount = priceAmount
        this.#date = date
    }

    submitNewTransactionLog(){
        return new Promise((resolve, reject) => {
            const insertQuery = "INSERT INTO Transaction (userID, sellerID, productID, priceAmount, date) VALUES (?, ?, ?, ?, ?)"
            connection.query(insertQuery, [this.#userID, this.#sellerID, this.#productID, this.#priceAmount, this.#date], (err, result) => {
                if (err) return reject(false);
                return resolve(true)
            })
        })

    }

    // Convert populate methods to return Promises
    populateSellerName(){
        return new Promise((resolve, reject) => {
            let query = "SELECT storepageName FROM Seller WHERE sellerID = ?"
            connection.query(query, [this.#sellerID], (err, results) => {
                if (err) return reject(err);
                if (results.length === 0) return resolve('');

                this.#sellerName = results[0].storepageName;
                resolve();
            })
        });
    }

    populateUserName(){
        return new Promise((resolve, reject) => {
            let query = "SELECT userName FROM User WHERE userID = ?"
            connection.query(query, [this.#userID], (err, results) => {
                if (err) return reject(err);
                if (results.length === 0) return resolve('');
                console.log(results)
                this.#userName = results[0].userName;
                resolve();
            })
        });
    }

    populateProductName(){
        return new Promise((resolve, reject) => {
            let query = "SELECT productName FROM Product WHERE productID = ?"
            connection.query(query, [this.#productID], (err, results) => {
                if (err) return reject(err);
                if (results.length === 0) return resolve('');

                this.#productName = results[0].productName;
                resolve();
            })
        });
    }

    // Utility function to populate all fields
    async populateAll(){
        try {
            await this.populateProductName();
            await this.populateSellerName();
            await this.populateUserName();
        } catch (error) {
            console.log(`Error populating fields: ${error}`);
        }
    }

    // Getter methods...
    getTransactionID() {
        return this.#transactionID
    }

    getUserID() {
        return this.#userID
    }

    getSellerID() {
        return this.#sellerID
    }

    getProductID() {
        return this.#productID
    }

    getPriceAmount() {
        return this.#priceAmount
    }

    getDate() {
        return this.#date
    }

    getProductName() {
        return this.#productName
    }

    getSellerName() {
        return this.#sellerName
    }

    getUserName() {
        return this.#userName
    }
}

module.exports = { Transaction };