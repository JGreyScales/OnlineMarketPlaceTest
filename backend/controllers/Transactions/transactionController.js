const { Transaction } = require('./transactionClass');
const connection = require("../../models/db");

class TransactionList {
    #transactions = [];

    constructor() {}

    static transactionExists(transactionID){
        const query = "SELECT 1 WHERE EXISTS (SELECT 1 FROM Transaction WHERE transactionID = ?)"
        connection.query(query, [transactionID], (err, results) => {
            if (err) return false;
            if (results.length === 1) return true;
        })
    }

    // Mark the method as async so that you can use await inside it
    async getTransaction(ID, columnName) {
        return new Promise((resolve, reject) => {
            let transactionQuery = `SELECT transactionID, userID, sellerID, productID, priceAmount, date FROM Transaction WHERE ${columnName} = ? ORDER BY date DESC`;
            connection.query(transactionQuery, [ID], async (err, results) => {
                if (err) {
                    console.log(err);
                    return reject({ statusCode: 500, message: `Database query error: ${err.sqlMessage}` });
                }

                if (results.length === 0) {
                    return reject({ statusCode: 404, message: 'No records found' });
                }

                for (const transaction of results) {
                    const { transactionID, userID, sellerID, productID, priceAmount, date } = transaction;
                    const transactionOBJ = new Transaction(transactionID, userID, sellerID, productID, priceAmount, date);

                    // Await the population of all the fields before pushing the transaction
                    await transactionOBJ.populateAll();

                    this.#transactions.push({
                        transactionID: transactionOBJ.getTransactionID(),
                        userID: transactionOBJ.getUserID(),
                        sellerID: transactionOBJ.getSellerID(),
                        productID: transactionOBJ.getProductID(),
                        priceAmount: transactionOBJ.getPriceAmount(),
                        date: transactionOBJ.getDate(),
                        productName: transactionOBJ.getProductName(),
                        sellerName: transactionOBJ.getSellerName(),
                        userName: transactionOBJ.getUserName()
                    });
                }

                return resolve({ statusCode: 200, transactionList: this.#transactions });
            });
        });
    }

    getTransactions() {
        return this.#transactions;
    }
}

module.exports = { TransactionList };