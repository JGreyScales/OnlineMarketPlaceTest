const {authenticateToken} = require('../middleware/auth')
ALLOWED_FIELDS = [];
// transactions can only be created from the backend side
// users will never send an API request specifically to make a transaction
// the only API requests involving transactions will be the retrieval of them

async function validateGetTransaction(req, res, next) {
    const isAuthenticated = await authenticateToken(req);
    if (!isAuthenticated) {
        return res.status(401).json({ error: 'Authentication Failed' });
    }

    if (!req.params.transID && !req.params.userID && !req.params.sellerID && !req.params.productID){
        // if at least one does not exist its 
        res.status(400).json({error: `No valid target found`})
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

module.exports = {validateGetTransaction}