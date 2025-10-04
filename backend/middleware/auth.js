const jwt = require('jsonwebtoken')
const {Product} = require('../controllers/Product/productController')


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

            // Check if `userID` exists in request params
            if (req.params.userID) {
                // If userID exists in params, check if the payload's userID matches the request's userID
                if (payload.userID !== parseInt(req.params.userID)) {
                    // If method is GET and the route path is exactly '/:userID', skip this check
                    if (req.method === 'GET' && req.route.path === '/:userID') {
                        return resolve(true)
                    }

                    // If userIDs do not match and we are not in the default GET route, return false
                    console.log('failed on user object permission checking');
                    return resolve(false);
                }
            }

            if (req.params.sellerID) {
                if (payload.userID !== parseInt(req.params.sellerID)){
                    if (req.method === 'GET' && (req.route.path === '/:sellerID/products/:amount/page/:pageNumber' ||req.route.path === '/:sellerID' || req.route.path === '/:sellerID/products' || req.route.path === '/:sellerID/rating')) {
                        return resolve(true)
                    }

                    console.log('Failed on seller object permission checking')
                    return resolve(false)
                }
            }

            if (req.params.productID) {
                const sellerID = Product.getSellerID(req.params.productID)
                if (payload.userID !== sellerID) {
                    if (req.method === 'GET' && (req.route.path === '/:productID' || req.route.path === '/:productID/purchase')){
                        return resolve(true)
                    } else if (req.method === 'POST' && req.route.path === '/:productID/rating') {
                        return resolve(true)
                    }
                    console.log('Failed on productSeller object permission checking')
                    return resolve(false)
                }
            }


            return resolve(true); // Authentication successful
        });
    });
}

function getUserIDFromToken(req){
    return new Promise((resolve, reject) => {
        let token;
        if (typeof(req) === 'string'){token = req?.split(' ')[1]}
        else {token = req.header('Authorization')?.split(' ')[1];}
        

        jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
            if (err) return reject(NaN);
            return resolve(payload.userID);
        })
    })
   
}

function generateToken(userID) {
    return jwt.sign(
        { 'userID': userID},
        process.env.JWT_SECRET,
        {'expiresIn':"1h"}
    )
}


module.exports = {authenticateToken, generateToken, getUserIDFromToken}