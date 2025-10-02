const {authenticateToken} = require('../middleware/auth')
const ALLOWED_FIELDS = ['productID', 'sellerID', 'transactionID'];
// transactions can only be created from the backend side
// users will never send an API request specifically to make a transaction
// the only API requests involving transactions will be the retrieval of them

async function validateGetTransaction(req, res, next) {
    const isAuthenticated = await authenticateToken(req);
    if (!isAuthenticated) {
        return res.status(401).json({ error: 'Authentication Failed' });
    }

    if (req.params.transID){
        var transID = parseInt(req.params.transID)
        if (isNaN(transID) || transID < 0){
            // if transID is invalid
            res.status(401).json({error: `Invalid TransactionID`})
        }
    }

    if (req.params.userID){
        var userID = parseInt(req.params.userID)
        if (isNaN(userID) || userID < 0){
            // if userID is invalid
            res.status(401).json({error: `Invalid UserID`})
        }
    }

    if (req.params.sellerID){
        var sellerID = parseInt(req.params.sellerID)
        if (isNaN(sellerID) || sellerID < 0){
            // if sellerID is invalid
            res.status(400).json({error: `sellerID is not valid`})
        }
    }

    if (req.params.productID){
        var productID = parseInt(req.params.productID)
        if (isNaN(productID) || productID < 0){
            // if productID is invalid
            res.status(400).json({error: `productID is not valid`})
        }
    }

    next();
}

async function validatePostTransaction(req, res, next) {
    try {
        await validateGetTransaction(req, res, (err) => {
            if (err) return res.status(err.status || 400).json(err);

            // body can not exist in the case of a filter not being requested
            if (req.body){
                Object.keys(req.body).forEach((key) => {
                    if (!ALLOWED_FIELDS.includes(key)) {
                        // invalid key is contained in the request
                        return res.status(400).json({error: `Invalid field: ${key}`})
                    }
                })
                if (req.body.productID) {
                    if (isNaN(parseInt(req.body.productID)) || parseInt(req.body.productID) < 1){
                        return res.status(400).json({error: `Invalid productID`})
                    }
                }
    
                if (req.body.sellerID) {
                    if (isNaN(parseInt(req.body.sellerID)) || parseInt(req.body.sellerID) < 1){
                        return res.status(400).json({error: `Invalid sellerID`})
                    }
                }
    
                if (req.body.transactionID) {
                    if (isNaN(parseInt(req.body.transactionID)) || parseInt(req.body.transactionID) < 1){
                        return res.status(400).json({error: `Invalid transactionID`})
                    }
                }
            }
           

            next()
        })
    } catch (error) {
        return res.status(400).json(error.message)
    }
}

module.exports = {validateGetTransaction, validatePostTransaction}