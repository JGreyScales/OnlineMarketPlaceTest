const {Product} = require('../controllers/Product/productController')
const {authenticateToken} = require('../middleware/auth')
ALLOWED_FIELDS = ['userID', 'productName', 'productBio', 'productPrice', 'rating']

function validateGetProduct(req, res, next){
    if (!authenticateToken(req)){
        res.status(401).json({error: 'Authentication Failed'})
    }

    if (req.body){
        Object.keys(req.body).forEach((key) => {
            if (!ALLOWED_FIELDS.includes(key)) {
                return res.status(400).json({error: `Invalid field: ${key}`})
            }
        })
    }


    if (req.params.productID){
        var productID = parseInt(req.params.productID)
        if (isNaN(productID) || productID < 0){
            res.status(400).json({error: `Invalid productID`})
        }
    }


    next()
}

function validatePostProduct(req, res, next){
    validateGetProduct(req, res, (err) => {
        if (err) return res.status(err.status || 400).json(err)


        if ('productName' in req.bos && req.body['productName'].length > Product.MAX_PRODUCT_NAME_LENGTH){
            return res.status(400).json({error: `productName too long`})
        }
    
        if ('productBio' in req.body && req.body['productBio'].length > Product.MAX_PRODUCT_BIO_LENGTH){
            return res.status(400).json({error: `productBio too long`})
        }
    
        if ('productPrice' in req.body){
            var productPrice = parseInt(req.body['productPrice'])
            if (isNaN(productPrice) || productPrice < 0){
                return res.status(400).json({error: `productPrice is invalid`})
            }
        }
    
        if ('rating' in req.body){
            var rating = parseInt(req.body['rating'])
            if (isNaN(rating) || rating < Product.MIN_RATING_VALUE || rating > Product.MAX_RATING_VALUE){
                res.status(400).json({error: `rating is invalid`})
            }
        }
    
        next();
    })
}

function validateDeleteProduct(req, res, next){
    validatePostProduct(req, res, (err) => {
        if (err) return res.status(err.status || 400).json(err)
    })

    next()
}