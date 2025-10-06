const {Product} = require('./productController')
const connection = require("../../models/db")
const {Transaction} = require("../Transactions/transactionClass")

class ProductList {
    constructor(){}

    createProduct(valuesDict){
        return new Promise((resolve, reject) => {
            valuesList.createdAt = new Date().toISOString().split('T')[0]
            let query ="INSERT INTO Product ("
            const columnNameList = [];
            const valuesList = [];
            for (let field in valuesDict) {
                columnNameList.push(field);
                valuesList.push(valuesDict[field]);
            }
            query += columnNameList.join(', ') + ") VALUES (";
            query += valuesList.map(() => '?').join(', ') + ")";

            connection.query(query, valuesList, (err, results) => {
                if (err) return reject({statusCode: 400, message: `Database query error:${err.sqlMessage}`});
                resolve({statusCode: 202, message: `Product created`})
            })
        })
    }

    async purchaseProduct(buyerID, productID) {
        try {
            // Fetch product details
            const productOBJ = (await this.getProduct(productID)).data;
    
            // Verify if the user has sufficient funds
            const userFundQuery = "SELECT userFundsAmount FROM User WHERE userID = ?";
            const userFundsResult = await new Promise((resolve, reject) => {
                connection.query(userFundQuery, [buyerID], (err, results) => {
                    if (err) return reject({ statusCode: 400, message: `Database query error: ${err.sqlMessage}` });
                    if (results.length === 0) return reject({ statusCode: 404, message: 'User not found' });
                    resolve(results);
                });
            });
    
            const userFunds = parseFloat(userFundsResult[0].userFundsAmount);
            if (userFunds < parseFloat(productOBJ.productPrice)) {
                console.log('User does not have enough funds');
                throw { statusCode: 400, message: "User does not have enough funds" };
            }
            console.log('User does have enough funds');
    
            // Remove the funds from the user's account
            const updateUserFundQuery = "UPDATE User SET userFundsAmount = userFundsAmount - ? WHERE userID = ?";
            await new Promise((resolve, reject) => {
                connection.query(updateUserFundQuery, [productOBJ.productPrice, buyerID], (err, results) => {
                    if (err) return reject({ statusCode: 400, message: `Database query error: ${err.sqlMessage}` });
                    resolve(results);
                });
            });
    
            // Create a transaction log
            const date = new Date().toISOString().split('T')[0];
            const TransactionOBJ = new Transaction(buyerID, productOBJ.sellerID, productID, productOBJ.productPrice, date);
            await TransactionOBJ.submitNewTransactionLog();
    
            // Successfully purchased
            return { statusCode: 200 };
    
        } catch (error) {
            // Handle any errors that may have occurred
            return { statusCode: 500, message: error};
        }
    }
    

    static productExists(productID){
        return new Promise((resolve, reject) => {
            const query = "SELECT 1 WHERE EXISTS (SELECT 1 FROM Product WHERE productID = ?)"
            connection.query(query, [productID], (err, results) => {
                if (err) return resolve(false);
                if (results.length === 1) return resolve(true);
            })
        })

    }

    async createProductRating(productID, rating, userID) {
        try {
            // Query to check if the user is a verified buyer
            const verifiedBuyerQuery = "SELECT 1 FROM Transaction WHERE userID = ? AND productID = ?";
            const verifiedBuyer = await new Promise((resolve, reject) => {
                connection.query(verifiedBuyerQuery, [userID, productID], (err, results) => {
                    if (err) return reject({ statusCode: 400, message: `Database query error: ${err.sqlMessage}` });
                    if (results.length === 1) {
                        return resolve(true);
                    } else {
                        return resolve(false);
                    }
                });
            });
    
            // Insert the rating into the database
            const query = "INSERT INTO Rating (productID, rating, userID, verifiedBuyer) VALUES (?, ?, ?, ?)";
            await new Promise((resolve, reject) => {
                connection.query(query, [productID, rating, userID, verifiedBuyer], (err, results) => {
                    if (err) return reject({ statusCode: 400, message: `Database query error: ${err.sqlMessage}` });
                    resolve(results);
                });
            });
    
            // Return success message
            return { statusCode: 202, message: "Rating added" };
        } catch (err) {
            // Handle any errors
            console.log(err);
            return { statusCode: 400, message: `Database query error: ${err.message || err.sqlMessage}` };
        }
    }
    
    

    async patchProduct(valuesDict, productID){
        return new Promise((resolve, reject) => {
            const query = "UPDATE Product SET "
            const updates = []
            const valuesList = []

            for (let field in valuesDict){
                updates.push(`${field} = ?`)
                valuesList.push(valuesDict[field])
            }

            query += updates.join(', ') + " WHERE productID = ?"
            valuesList.push(productID)

            connection.query(query, valuesList, (err, results) => {
                if (err) return reject({statusCode: 400, message: `Database query error:${err.sqlMessage}`});
                return resolve({statusCode: 202, message: `Product Updated`})
            })
        })
    }

    async getProduct(productID){
        return new Promise((resolve, reject) => {
            const query = "SELECT sellerID, productImage, productName, productBio, productPrice, updatedAt, createdAt FROM Product WHERE productID = ?"
            connection.query(query, [productID], async (err, results) => {
                if (err) return reject({statusCode: 400, error: `Database query error:${err.sqlMessage}`});
                if (results.length === 0) return reject({statusCode:404, error: `Product Not Found`})

                const {sellerID, productImage, productName, productBio, productPrice, updatedAt, createdAt} = results[0]
                const productOBJ = new Product(parseInt(productID), sellerID, productImage, productName, productBio, productPrice, updatedAt, createdAt);

                await productOBJ.populateAll();

                return resolve({statusCode: 200, data:{
                    productID: productOBJ.getProductID(),
                    sellerID: productOBJ.getSellerID(),
                    storepageName: productOBJ.getStorepageName(),
                    productImage: productOBJ.getProductImage(),
                    productName: productOBJ.getProductName(),
                    productBio: productOBJ.getProductBio(),
                    productPrice: productOBJ.getProductPrice(),
                    productRating: productOBJ.getProductRating(),
                    updatedAT: productOBJ.getUpdatedAt(),
                    createdAT: productOBJ.getCreatedAt(),
                    interests: productOBJ.getInterestTags()
                }})
            })
        })
       
    }

    async deleteProduct(productID) {
        return new Promise((resolve, reject) => {
            const query = "DELETE FROM Product WHERE productID = ?"
            connection.query(query, [productID], (err, results) => {
                if (err) return reject({statusCode: 400, message: `Database query error:${err.sqlMessage}`});
                return resolve({statusCode: 202, message: `Product queued for deletion`})
            })
        })
    }

    userIsSeller(sellerID) {
        return new Promise((resolve, reject) => {
            const query = "SELECT 1 WHERE EXISTS (SELECT 1 FROM Seller WHERE sellerID = ?)"
            connection.query(query, [sellerID], (err, results) => {
                if (err) return resolve(false);
                if (results.length === 1) return resolve(true);
            })
        })
    }
}


module.exports = { ProductList };