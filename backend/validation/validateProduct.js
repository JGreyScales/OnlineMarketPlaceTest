const {Product} = require('../controllers/Product/productController')
const {authenticateToken} = require('../middleware/auth')
ALLOWED_FIELDS = ['login-cookie', 'userID', 'productName', 'productBio', 'productPrice', 'rating']

function validateGetProduct(req, res){
    Object.keys(req.body).forEach((key) => {
        if (!ALLOWED_FIELDS.includes(key)) {
            res.status(400).end()
            return false
        }
    })

    if (req.params.productID){
        var productID = parseInt(req.params.productID)
        if (isNaN(productID) || productID < 0){
            res.status(401).end()
            return false
        }
    }

    if (!authenticateToken(res.body['userID'], res.body['login-cookie'])){
        res.status(401).end()
        return false
    }
    return true
}

function validatePostProduct(req, res){
    if (!validateGetProduct(req, res)){
        return false
    }

    if (res.body['productName'] && res.body['productName'].length > Product.MAX_PRODUCT_NAME_LENGTH){
        res.status(400).end()
        return false
    }

    if (res.body['productBio'] && res.body['productBio'].length > Product.MAX_PRODUCT_BIO_LENGTH){
        res.status(400).end()
        return false
    }

    if (res.body['productPrice']){
        var productPrice = parseInt(res.body['productPrice'])
        if (isNaN(productPrice) || productPrice < 0){
            res.status(400).end()
            return false
        }
    }

    if (res.body['rating']){
        var rating = parseInt(res.body['rating'])
        if (isNaN(rating) || rating < Product.MIN_RATING_VALUE || rating > Product.MAX_RATING_VALUE){
            res.status(400).end()
            return false;
        }
    }

    return true
}

function validateDeleteProduct(req, res){
    if (!validatePostProduct(req, res)){
        return false
    }

    return true
}