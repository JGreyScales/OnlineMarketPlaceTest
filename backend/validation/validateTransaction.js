const {Transaction} = require('../controllers/Transactions/transactionClass')
const {authenticateToken} = require('../middleware/auth')
ALLOWED_FIELDS = ['userID'];
// transactions can only be created from the backend side
// users will never send an API request specifically to make a transaction
// the only API requests involving transactions will be the retrieval of them

function validateGetTransaction(req, res, next) {
    if (!authenticateToken(req)){
        return res.status(401).json({error: 'Authentication Failed'})
    }

    if (req.body){
        Object.keys(req.body).forEach((key) => {
            if (!ALLOWED_FIELDS.includes(key)) {
                return res.status(400).json({error: `Invalid field: ${key}`})
            }
        })
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

        // if requesting for a specific user, you must be to that user
        var senderID = parseInt(req.body['userID'])
        if (isNaN(senderID) || senderID < 0){
            res.status(401).json({error: `Invalid SenderID`})
        }

        if (senderID != userID){
            res.status(401).json({error: `SenderID must match userID`})
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