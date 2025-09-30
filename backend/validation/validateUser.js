const {User} = require('../controllers/userController')
const {authenticateToken} = require('../middleware/auth')
const ALLOWED_FIELDS = ['userID', 'userPhoto', 'userBio', 'userName', 'email', 'password'];


function validateGetUser(req, res, next) {
    if (!authenticateToken(req)){
        return res.status(401).json({error: 'Authentication Failed'})
    }

    if (req.body){
        Object.keys(req.body).forEach((key) => {
            if (!ALLOWED_FIELDS.includes(key)) {
                // invalid key is contained in the request
                return res.status(400).json({error: `Invalid field: ${key}`})
            }
        })
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

function validatePostUser(req, res, next) {

    validateGetUser(req, res, (err) => {
        // forward any errors from getUser towards the next middleware
        if (err) return res.status(err.status || 400).json(err)

        if (!req.body){
            return res.status(400).json({error: `No body present`})
        }

        if (!req.body.userID){
            return res.status(400).json({error: `no senderID present`})    
        }



        var senderUserID = parseInt(req.body['userID'])
        var targetUserID = parseInt(req.params.userID) // we know this is not NaN from the getUser check
        if (isNaN(senderUserID) || senderUserID < 0){
            // senderUserID is not valid
            return res.status(400).json({error: 'Invalid senderUserID'})
        }
    
        if (senderUserID != targetUserID){
            // target User must be same as sender User
            return res.status(401).json({error: `SenderID does not match targetID`})
        }
    
        
        if (req.body.email && req.body['email'].length > User.MAX_EMAIL_LENGTH){
            // email is too long
            return res.status(400).json({error: `Email is too long`})
        }
    
        if (req.body.password && req.body['password'].length > User.MAX_PASSWORD_LENGTH) {
            // password is too long
            return res.status(400).json({error: `Password is too long`})
        }
        
        if (req.body.userBio && req.body['userBio'].length > User.MAX_BIO_LENGTH){
            return res.status(400).json({error: `UserBio is too long`})
        }
    
        if (req.body.userName && req.body['userName'].length > User.MAX_USERNAME_LENGTH){
            return res.status(400).json({error: `UserName is too long`})
        }
    
       next()
    })
}

function validateDeleteUser(req, res, next) {
  validatePostUser(req, res, (err) => {
    if (err) return res.status(err.status || 400).json(err)

        next()
    })
}

module.exports = {validateDeleteUser, validatePostUser, validateGetUser}