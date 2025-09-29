const {seller} = require("../controllers/sellerController")
ALLOWED_FIELDS = ['login-cookie', 'userID']

function validateGetSeller(req, res){
    Object.keys(req.body).forEach((key) => {
        if (!ALLOWED_FIELDS.includes(key)){
            res.status(400).end()
            return false
        }
    })
    
    if (req.params.sellerID){
        var sellerID = parseInt(req.params.sellerID)
        if (isNaN(sellerID) || sellerID < 0){
            res.status(401).end()
            return false
        }
    }
    return true
}

function validatePostSeller(req, res){
    if (!validateGetSeller(req, res)){
        return false
    }

    var senderUserID = parseInt(res.body['userID'])
    var targetSellerID = parseInt(res.params.sellerID) // we know this is not NaN from the getSeller check
    if (isNaN(senderUserID) || senderUserID < 0){
        // senderUserID is not valid
        res.status(401).end()
        return false
    }

    if (senderUserID != targetSellerID){
        // senderID must equal sellerID
        res.status(401).end()
        return false
    }

    return true
}

function validateDeleteSeller(req, res){
    if (!validatePostSeller(req, res)){
        return false
    }
}