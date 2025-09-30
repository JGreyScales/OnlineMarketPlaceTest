const {Seller} = require("../controllers/sellerController")
const {authenticateToken} = require('../middleware/auth')
ALLOWED_FIELDS = ['userID', 'storepageBio', 'storepagePhoto', 'storepageName']

function validateGetSeller(req, res, next){
    if (!authenticateToken(req)){
        return res.status(401).json({error: 'Authenticaton Failed'})
    }

    if (req.body){
        Object.keys(req.body).forEach((key) => {
            if (!ALLOWED_FIELDS.includes(key)){
                return res.status(400).json({error: `Invalid field: ${key}`})
            }
        })
    }

    if (req.params.sellerID){
        var sellerID = parseInt(req.params.sellerID)
        if (isNaN(sellerID) || sellerID < 0){
            res.status(400).json({error: `Invalid sellerID`})
        }
    }

    next();
}

function validatePostSeller(req, res){
    validateGetSeller(req, res, (err) => {
        if (err) return res.status(err.status || 400).json(err)

        if (!req.body){
            return res.status(400).json({error: `No body present`})
        }

        if (!req.body.userID){
            return res.status(400).json({error: `No senderID present`})
        }
        
        var senderUserID = parseInt(req.body['userID'])
        var targetSellerID = parseInt(req.params.sellerID) // we know this is not NaN from the getSeller check
        if (isNaN(senderUserID) || senderUserID < 0){
            // senderUserID is not valid
            return res.status(400).json({error: `senderID is not present`})
        }
    
        if (senderUserID != targetSellerID){
            // senderID must equal sellerID
            return res.status(401).json({error: `SenderID does not match targetID`})
        }
    
        if (req.body.storepageBio && req.body['storepageBio'].length > Seller.MAX_SELLER_STORAGEPAGE_BIO_LENGTH){
            return res.status(400).json({error: `storepageBio is too long`})
        }
    
        if (req.body.storepageName && req.body['storepageName'].length > Seller.MAX_SELLER_STOREPAGE_NAME_LENGTH){
            return res.status(400).json({error: `storagepageName is too long`})
        }
    
        next();
    })
}

function validateDeleteSeller(req, res, next){
    validatePostSeller(req, res, (err) => {
        if (err) return res.status(err.status || 400).json(err)
    })
}