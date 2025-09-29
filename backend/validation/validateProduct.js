const {Product} = require('../controllers/Product/productController')
ALLOWED_FIELDS = ['login-cookie', 'userID']

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

    return true
}

function validatePostProduct(req, res){
    if (!validateGetProduct(req, res)){
        return false
    }
    return true
}

function validateDeleteProduct(req, res){
    if (!validatePostProduct(req, res)){
        return false
    }

    return true
}