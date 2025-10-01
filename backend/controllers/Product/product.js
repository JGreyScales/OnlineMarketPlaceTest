const {Product} = require('./productController')
const connection = require("../../models/db")
const shuffle = require("../../utils/shuffleArray")
class ProductList {
    constructor(){}

    createProduct(valuesDict){
        return new Promise((resolve, reject) => {
            const query ="INSERT INTO Product ("
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

    static productExists(productID){
        const query = "SELECT 1 WHERE EXISTS (SELECT 1 FROM Product WHERE productID = ?)"
        connection.query(query, [productID], (err, results) => {
            if (err) return false;
            if (results.length === 1) return true;
        })
    }

    async createProductRating(productID, rating, userID){
        return new Promise((resolve, reject) => {
            query = "INSERT INTO Rating (productID, rating, userID, verifiedBuyer) VALUES (?, ?, ?, ?)"
            verifiedBuyerQuery = "SELECT 1 WHERE EXISTS (SELECT 1 FROM Transaction WHERE userID = ? AND productID = ?)"
            const verifiedBuyer = false

            connection.query(verifiedBuyerQuery, [userID, productID], (err, results) => {
                if (err) return reject({statusCode: 400, message: `Database query error:${err.sqlMessage}`});
                if (results.length === 1) verifiedBuyer = true;
            })

            connection.query(query, [productID, rating, userID, verifiedBuyer], (err, results) => {
                if (err) return reject({statusCode: 400, message: `Database query error:${err.sqlMessage}`});
                return resolve({statusCode: 202, message: `rating added`})
            })

        })
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

    static userIsSeller(sellerID) {
        const query = "SELECT 1 WHERE EXISTS (SELECT 1 FROM Seller WHERE sellerID = ?)"
        connection.query(query, [sellerID], (err, results) => {
            if (err) return false;
            if (results.length === 1) return true;
        })
    }
}


module.exports = { ProductList };