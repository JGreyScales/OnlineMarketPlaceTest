const {Product} = require('./productController')
const connection = require("../../models/db")

class ProductList {
    #products

    constructor(){}

    async getProduct(productID){
        return new Promise((resolve, reject) => {
            const query = "SELECT sellerID, productImage, productName, productBio, productPrice, updatedAt, createdAt FROM Product WHERE productID = ?"
            connection.query(query, [productID], async (err, results) => {
                if (err) return reject({statusCode: 400, error: `Database query error:${err.sqlMessage}`});
                if (results.lenth === 0) return reject({statusCode:404, error: `Product Not Found`})

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
}


module.exports = { ProductList };