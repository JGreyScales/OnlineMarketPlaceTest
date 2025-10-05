const { isEmpty } = require("validator");
const {Seller} = require("../controllers/sellerController")
const {authenticateToken} = require('../middleware/auth')
const ALLOWED_FIELDS = ['storepageBio', 'storepagePhoto', 'storepageName']

async function validateGetSeller(req, res, next){
    const isAuthenticated = await authenticateToken(req);
    if (!isAuthenticated) {
        return res.status(401).json({error: `Authentication Failed`})
    }

    if (req.params.sellerID){
        if (isNaN(parseInt(req.params.sellerID)) || req.params.sellerID < 1){
            if (req.params.sellerID !== 'home'){
                return res.status(400).json({error: `Invalid sellerID`})
            }
        }
    }

    if (req.params.amount){
        if (isNaN(parseInt(req.params.amount)) || req.params.amount < 1){
            return res.status(400).json({error: 'Invalid get amount'})
        }
    }

    if (req.params.pageNumber){
        if (isNaN(parseInt(req.params.pageNumber)) || req.params.pageNumber < 0){
            return res.status(400).json({error: 'Invalid page number'})
        }
    }

    next()
}

async function validatePostSeller(req, res, next){
    try {
        await validateGetSeller(req, res, (err) => {
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

            if (req.body.storepageBio){
                if (isEmpty(req.body.storepageBio) || req.body.storepageBio.length > Seller.MAX_SELLER_STORAGEPAGE_BIO_LENGTH) {
                    return res.status(400).json({error: `Invalid storepage Bio`})
                }
            }

            if (req.body.storepageName){
                if (req.body.storepageName.length < Seller.MIN_SELLER_STORAGEPAGE_NAME_LENGTH || req.body.storepageName.length > Seller.MAX_SELLER_STORAGEPAGE_BIO_LENGTH){
                    return res.status(400).json({error: `Invalid storepage Name`})
                }
            }

            next()
        })
    } catch (error) {
        return res.status(400).json(error.message)
    }
}

async function validateDeleteSeller(req, res, next){
    try {
        await validatePostSeller(req, res, (err) => {
            if (err) return res.status(err.status || 400).json(err);

            next()
        })
    } catch (error){
        return res.status(400).json(error.message)
    }
}

module.exports = {validateDeleteSeller, validatePostSeller, validateGetSeller}