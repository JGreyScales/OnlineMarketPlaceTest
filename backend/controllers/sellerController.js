const connection = require("../models/db")
const ProductList = require("../controllers/Product/product")
class Seller {
    #sellerID
    #productList = []
    MAX_SELLER_STORAGEPAGE_BIO_LENGTH = 500;
    MAX_SELLER_STOREPAGE_NAME_LENGTH = 25;
    MIN_SELLER_STORAGEPAGE_NAME_LENGTH = 2;

    constructor(){}

    setSellerID(sellerID){
        this.#sellerID = sellerID
    }


    getSeller(){
        return new Promise((resolve, reject) => {
            let query = "SELECT storepageBio, storepagePhoto, storepageName FROM Seller WHERE sellerID = ?"
            connection.query(query, [this.#sellerID], (err, results) => {
                if (err) return reject({statusCode: 400, message: `Database query error: ${err.sqlMessage}`});
                if (results.length === 0) return reject({statusCode: 404, message: 'Seller not found'});
            
                const {storepageBio, storepagePhoto, storepageName} = results
                return resolve({statusCode: 200, storepageBio: storepageBio, storepagePhoto: storepagePhoto, storepageName: storepageName})
                })
        })
    }

    getSellerRating(){
        return new Promise((resolve, reject) => {
            let query = `SELECT AVG(r.rating) as rating FROM Rating r JOIN Product p ON p.productID = r.productID WHERE p.sellerID = ?`
            connection.query(query, [this.#sellerID], (err, results) => {
                if (err) return reject({statusCode: 400, message: `Database query error: ${err.sqlMessage}`});
                if (results.length === 0) return reject({statusCode: 404, message: 'Seller not rated', rating: 0.0});
                return resolve({statusCode: 200, rating: parseFloat(results[0].rating).toFixed(1)})
            })
        })
    }

    getSellerProducts(amount){
        return new Promise((resolve, reject) => {
            let query = "SELECT productID FROM Product WHERE sellerID = ? limit ?"
            const productIDList = []
            connection.query(query, [this.#sellerID, amount], (err, results) => {
                if (err) return reject({statusCode: 400, message: `Database query error: ${err.sqlMessage}`});
                if (results.length === 0) return reject({statusCode: 404, message: 'Products not found'});
                results.map(Product => productIDList.push(Product.productID))
            })

            const productListOBJ = new ProductList()
            productIDList.forEach((ID) => {
                try {
                    const result = productListOBJ.getProduct(ID)
                    this.#productList.push(result.data)
                } catch (error) {
                    return reject({statusCode: 400, message: error.message});
                }
            })

            return resolve({statusCode: 200, data: this.#productList})
        })

    }
    
    createSeller(){
        return new Promise((resolve, reject) => {
            const query = "INSERT INTO Seller (sellerID) VALUES (?)"
            connection.query(query, [this.#sellerID], (err, results) => {
                if (err) return reject({statusCode: 400, message: `Database query error:${err.sqlMessage}`});
                return resolve({statusCode:201, message: 'Seller Created'})
            })
        })
    }

    patchSeller(valuesDict){
        return new Promise((resolve, reject) => {
            const query = "UPDATE Seller SET "
            const updates = []
            const valuesList = []

            for (let field in valuesDict){
                updates.push(`${field} = ?`)
                valuesList.push(valuesDict[field])
            }

            query += updates.join(', ') + " WHERE sellerID = ?"
            valuesList.push(this.#sellerID)

            connection.query(query, valuesList, (err, results) => {
                if (err) return reject({statusCode: 400, message: `Database query error:${err.sqlMessage}`});
                return resolve({statusCode: 202, message: `Seller Updated`})
            })
        })
    }

    deleteSeller(){
        return new Promise((resolve, reject) => {
            const query = "DELETE FROM Seller WHERE sellerID = ?"
            const productQuery = "DELETE FROM Product WHERE sellerID = ?"
            connection.query(productQuery, [this.#sellerID], (err, results) => {
                if (err) return reject({statusCode: 400, message: `Database query error:${err.sqlMessage}`});
            })
            connection.query(query, [this.#sellerID], (err, results) => {
                if (err) return reject({statusCode: 400, message: `Database query error:${err.sqlMessage}`});
            })
            return resolve({statusCode: 200, message: `Seller Deleted`})
        })
    }
}

module.exports = {Seller};
