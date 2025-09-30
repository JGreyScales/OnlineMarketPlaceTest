const jwt = require('jsonwebtoken')

function authenticateToken(req) {
    return new Promise((resolve, reject) => {
        // format "Bearer <token>"
        const token = req.header('Authorization')?.split(' ')[1];

        if (!token) {
            console.log('failed on token')
            return resolve(false); // No token, reject
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
            if (err) {
                console.log(`failed on ${err}`)
                return resolve(false); // Invalid token, reject
            }
            if (req.params.userID && (payload['userID'] != req.params.userID)){
                console.log('failed on payload checking')
                return resolve(false);
            }

            return resolve(true); // Authentication successful
        });
    });
}


function generateToken(userID) {
    return jwt.sign(
        { 'userID': userID},
        process.env.JWT_SECRET,
        {'expiresIn':"1h"}
    )
}


module.exports = {authenticateToken, generateToken}