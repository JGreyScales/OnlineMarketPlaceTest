const {Transaction} = require('../controllers/Transactions/transactionClass')
const {authenticateToken} = require('../middleware/auth')
ALLOWED_FIELDS = ['login-cookie', 'userID'];
// transactions can only be created from the backend side
// users will never send an API request specifically to make a transaction
// the only API requests involving transactions will be the retrieval of them

function validateGetTransaction(req, res) {
    Object.keys(req.body).forEach((key) => {
        if (!ALLOWED_FIELDS.includes(key)) {
            res.status(400).end()
            return false
        }
    })

    if (!authenticateToken(req)){
        res.status(401).end()
        return false
    }

    if (!req.params.transID && !req.params.userID && !req.params.sellerID && !req.params.productID){
        // if at least one does not exist its 
        res.status(401).end()
        return false
    }

    if (req.params.transID){
        var transID = parseInt(req.params.transID)
        if (isNaN(transID) || transID < 0){
            // if transID is invalid
            res.status(401).end()
            return false
        }
    }

    if (req.params.userID){
        var userID = parseInt(req.params.userID)
        if (isNaN(userID) || userID < 0){
            // if userID is invalid
            res.status(401).end()
            return false
        }

        // if requesting for a specific user, you must be to that user
        var senderID = parseInt(req.body['userID'])
        if (isNaN(senderID) || senderID < 0){
            res.status(401).end()
            return false
        }

        if (senderID != userID){
            res.status(401).end()
            return false
        }
    }

    if (req.params.sellerID){
        var sellerID = parseInt(req.params.sellerID)
        if (isNaN(sellerID) || sellerID < 0){
            // if sellerID is invalid
            res.status(401).end()
            return false
        }
    }

    if (req.params.productID){
        var productID = parseInt(req.params.productID)
        if (isNaN(productID) || productID < 0){
            // if productID is invalid
            res.status(401).end()
            return false
        }
    }

    return true
}