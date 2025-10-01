const {authenticateToken} = require('../middleware/auth')
const {ProductList} = require('../controllers/Product/product')
const {User} = require('../controllers/userController')
const ALLOWED_FIELDS = ['productID', 'userID', 'sellerID', 'tagID']

async function validateGetInterest(req, res, next) {
    const isAuthenticated = await authenticateToken(req);
    if (!isAuthenticated) {
        return res.status(401).json({error: 'Authentication Failed'})
    }

    if (req.params.interestHalfFilled){
        if (req.params.interestHalfFilled.length < 1 || req.params.interestHalfFilled > Interest.MAX_INTEREST_LENGTH){
            return res.status(400).json({error: 'Invalid Interest'})
        }
    }

    next()
}

async function validatePutInterest(req, res , next) {
    try {
        await validateGetInterest(req, res, (err) => {
            if (err) return res.status(err.status || 400).json(err)

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

            if (req.params.tagID) {req.body.tagID = req.params.tagID}
            if (req.body.tagID){
                if (isNaN(req.body.tagID) || req.body.tagID < 1){
                    return res.status(400).json({error: 'Invalid tagID'})
                }

                if (!Interest.tagExists(req.body.tagID)){
                    return res.status(404).json({error: 'TagID not found'})
                }
            }

            if (req.body.productID) {
                if (isNaN(req.body.productID) || req.body.productID < 1) {
                    return res.status(400).json({error: 'Invalid productID'})
                }

                if (!ProductList.productExists(req.body.productID)) {
                    return res.status(404).json({error: 'ProductID not found'})
                }
            }

            if (req.body.sellerID) {
                if (isNaN(req.body.sellerID) || req.body.sellerID < 1){
                    return res.status(400).json({error: 'Invalid sellerID'})
                }

                if (!ProductList.userIsSeller(req.body.sellerID)){
                    return res.status(404).json({error: 'SellerID not found'})
                }
            }

            if (req.body.userID) {
                if (isNaN(req.body.userID) || req.body.userID < 1){
                    return res.status(400).json({error: 'Invalid userID'})
                }

                if (!User.userExists(req.body.userID)) {
                    return res.status(404).json({error: 'UserID Not found'})
                }
            }

            next()
        })
    } catch (error) {
        return res.status(400).json(error.message)
    }
}

async function validateDeleteInterest(req, res, next) {
    try {
        await validatePutInterest(req, res, (err) => {
            if (err) return res.status(err.status || 400).json(err)

            next()
        })
    } catch (error) {
        return res.status(400).json(error.messsage)
    }
}

module.exports = {validateDeleteInterest, validatePutInterest, validateGetInterest}