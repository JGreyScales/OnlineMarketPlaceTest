const {authenticateToken} = require('../middleware/auth')
const {Interest} = require('../controllers/interestController')
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

            if (req.body.tagID){
                if (isNaN(req.body.tagID) || req.body.tagID < 1){
                    return res.status(400).json({error: 'Invalid tagID'})
                }
            }

            if (req.body.productID) {
                if (isNaN(req.body.productID) || req.body.productID < 1) {
                    return res.status(400).json({error: 'Invalid productID'})
                }
            }

            if (req.body.sellerID) {
                if (isNaN(req.body.sellerID) || req.body.sellerID < 1){
                    return res.status(400).json({error: 'Invalid sellerID'})
                }
            }

            if (req.body.userID) {
                if (isNaN(req.body.userID) || req.body.userID < 1){
                    return res.status(400).json({error: 'Invalid userID'})
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