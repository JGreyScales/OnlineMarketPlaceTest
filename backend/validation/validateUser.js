const {User} = require('../controllers/userController')
const {authenticateToken} = require('../middleware/auth')
const validator = require("validator")
const ALLOWED_FIELDS = ['userPhoto', 'userBio', 'userName', 'email', 'password', 'fundsAmount'];


async function validatePutUser(req, res, next) {
    if (!req.body){
        return res.status(400).json({error: `Must have content`})
    }
    
    if (!req.body.password || req.body.password.length > User.MAX_PASSWORD_LENGTH || req.body.password.length < 1){
        return res.status(400).json({error: `Must have valid password content`})
    }

    if (!req.body.email || !validator.isEmail(req.body.email) || req.body.email.length > User.MAX_EMAIL_LENGTH || req.body.email.length < 1){
        return res.status(400).json({error: `Must have valid email content`})
    }

    next()
}

async function validateGetUser(req, res, next) {
    const isAuthenticated = await authenticateToken(req);
    if (!isAuthenticated) {
        return res.status(401).json({ error: 'Authentication Failed' });
    }

    if (req.params.userID){
        var userID = parseInt(req.params.userID)
        if ( isNaN(userID) || userID < 0){
            // param userID is not valid
            return res.status(400).json({error: `Invalid userID`})
        }
    }


    next();
}

async function validatePostUser(req, res, next) {
    try {
        await validateGetUser(req, res, (err) => {
            // forward any errors from getUser towards the next middleware
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
            
            if (req.body.email){
                if (req.body.email.length > User.MAX_EMAIL_LENGTH || req.body.email.length < 1){
                    return res.status(400).json({error: `Email is not valid long`})
                }
            }
        
            if (req.body.password) {
                if (req.body.password.length > User.MAX_PASSWORD_LENGTH || req.body.password < 1) {
                    return res.status(400).json({error: `Password is not valid long`})
                }
            }
             
            if (req.body.userBio) {
                if (req.body.userBio.length > User.MAX_BIO_LENGTH) {
                    return res.status(400).json({error: `UserBio is not valid long`})
                }
            }
        
            if (req.body.userName) {
                if (req.body.userName.length > User.MAX_USERNAME_LENGTH) {
                    return res.status(400).json({error: `UserName is not valid long`})
                }
            }
        
           next()
        })
    } catch (error) {
        return res.status(400).json(error.message)
    }


}

async function validateDeleteUser(req, res, next) {
    try {
        await validateGetUser(req, res, (err) => {
            if (err) return res.status(err.status || 400).json(err)
            next()
        })
    } catch (error) {
        return res.status(400).json(error.message)
    }


}

module.exports = {validateDeleteUser, validatePostUser, validateGetUser, validatePutUser}