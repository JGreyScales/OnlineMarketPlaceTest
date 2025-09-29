const jwt = require('jsonwebtoken')

function authenticateToken(req){
    // format "Bearer <token>"
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return false
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if (err) return false

        if (payload['userID'] != req.body['userID']){
            return false
        }
        return true
    })

}

function generateToken(userID) {
    return jwt.sign(
        { 'userID': userID},
        process.env.JWT_SECRET,
        {'expiresIn':"1h"}
    )
}


module.exports = {authenticateToken, generateToken}