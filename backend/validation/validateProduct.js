const { isFloat, isInt } = require('validator');
const {Product} = require('../controllers/Product/productController')
const {authenticateToken} = require('../middleware/auth')
ALLOWED_FIELDS = ['productName', 'productImage', 'productBio', 'productPrice', 'rating']

async function validateGetProduct(req, res, next){
    const isAuthenticated = await authenticateToken(req)
    if (!isAuthenticated) {
        return res.status(401).json({ error: 'Authentication Failed' });
    }

   if (req.params.productID){
    if (isNaN(req.params.productID) || req.params.productID < 1){
        return res.status(400).json({error: `Invalid productID`})
    }
   }

    next()
}

async function validatePostProduct(req, res, next){
    try {
        await validateGetProduct(req, res, (err) => {
            if (err) return res.status(err.status || 400).json(err);

            if (req.body){
                Object.keys(req.body).forEach((key) => {
                    if (!ALLOWED_FIELDS.includes(key)) {
                        // invalid key is contained in the request
                        return res.status(400).json({error: `Invalid field: ${key}`})
                    }
                })
            } else {
                return res.status(400).json({error: `No body present`})
            }

            if (req.body.productName) {
                if (isNaN(req.body.productName) || req.body.productName.length < Product.MIN_PRODUCT_NAME_LENGTH || req.body.productName.length > Product.MAX_PRODUCT_NAME_LENGTH) {
                    return res.status(400).json({error: `Invalid productName`})
                }
            }

            if (req.body.productBio){
                if (isNaN(req.body.productBio) || req.body.productBio.length < Product.MIN_PRODUCT_BIO_LENGTH || req.body.productBio.length > Product.MAX_PRODUCT_BIO_LENGTH) {
                    return res.status(400).json({error: `Invalid productBio`})
                }
            }

            if (req.body.productPrice){
                if (!isFloat(req.body.productPrice) || parseFloat(req.body.productPrice) < Product.MIN_PRODUCT_PRICE) {
                    return res.status(400).json({error: `Invalid productPrice`})
                }
            }

            if (req.body.rating){
                if (!isInt(req.body.rating) || parseInt(req.body.rating) < Product.MIN_RATING_VALUE || parseInt(req.body.rating) > Product.MAX_RATING_VALUE){
                    return res.status(400).json({error: `Invalid rating`})
                }
            }

            next()
        })
    } catch (error) {
        return res.status(400).json(error.message)
    }
}

async function validateDeleteProduct(req, res, next){
   try {
       await validatePostProduct(req, res, (err) => {
        if (err) return res.status(err.status || 400).json(err);
    })
   } catch (error) {
    return res.status(400).json(error.message)
   }
    next()
}

module.exports = {validateDeleteProduct, validatePostProduct, validateGetProduct}