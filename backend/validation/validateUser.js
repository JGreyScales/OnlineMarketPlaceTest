const {User} = require('../controllers/userController')
const {authenticateToken} = require('../middleware/auth')
const ALLOWED_FIELDS = ['login-cookie', 'userID', 'userPhoto', 'userBio', 'userName', 'email', 'password'];


function validateGetUser(req, res) {
   Object.keys(req.body).forEach((key) => {
        if (!ALLOWED_FIELDS.includes(key)) {
            // invalid key is contained in the request
            res.status(400).end()
            return false
        }
    })

    if (req.body['login-cookie'].length != User.MAX_PASSWORD_LENGTH){
        // login-cookie is of invalid length
        res.status(401).end()
        return false
    }

    if (!authenticateToken(res.body['userID'], res.body['login-cookie'])){
        res.status(401).end()
        return false
    }

    if (res.params.userID){
        var userID = parseInt(res.params.userID)
        if ( isNaN(userID) || userID < 0){
            // param userID is not valid
            res.status(401).end()
            return false
        }
    }


    return true
}

function validatePostUser(req, res) {
    if (!validateGetUser(req, res)){
        return false
    }

    var senderUserID = parseInt(res.body['userID'])
    var targetUserID = parseInt(res.params.userID) // we know this is not NaN from the getUser check
    if (isNaN(senderUserID) || senderUserID < 0){
        // senderUserID is not valid
        res.status(401).end()
        return false
    }

    if (senderUserID != targetUserID){
        // target User must be same as sender User
        res.status(401).end()
        return false
    }

    if (res.body['email'] && res.body['email'].length > User.MAX_EMAIL_LENGTH){
        // email is too long
        res.status(401).end()
        return false
    }

    if (res.body['password'] && res.body['password'].length > User.MAX_PASSWORD_LENGTH) {
        // password is too long
        res.status(401).end()
        return false
    }
    
    if (res.body['userBio'] && res.body['userBio'].length > User.MAX_BIO_LENGTH){
        res.status(401).end()
        return false
    }

    if (res.body['userName'] && res.body['userName'].length > User.MAX_USERNAME_LENGTH){
        res.status(401).end()
        return false
    }

    return true
}

function validateDeleteUser(req, res) {
    if (!validatePostUser(req, res)){
        return false
    }

    return true
}
