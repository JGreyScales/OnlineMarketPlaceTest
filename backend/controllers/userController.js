const bcrypt = require("bcrypt")
const {generateToken} = require('../middleware/auth')
const {ProductList} = require('../controllers/Product/product')
const {Seller} = require("../controllers/sellerController")
const {Interest} = require('../controllers/interestController')
const connection = require("../models/db")
const shuffle = require("../utils/shuffleArray")
const SALT_ROUNDS = 14;

class User {
    #userID
    MAX_EMAIL_LENGTH = 40;
    MAX_PASSWORD_LENGTH = 256;
    MAX_BIO_LENGTH = 250;
    MAX_USERNAME_LENGTH = 20;

    constructor() {
        this.#userID = 0
    }

    setUserID(userID){
        this.#userID = userID
    }

    static userExists(userID){
        return new Promise((resolve, reject) => {
            const query = "SELECT 1 WHERE EXISTS (SELECT 1 FROM User WHERE userID = ?)"
            connection.query(query, [userID], (err, results) => {
                if (err) return resolve(false);
                if (results.length === 1) return resolve(true);
            })
        })

    }

    authenticateUser(email, password) {
        return new Promise((resolve, reject) => {
            let query = 'SELECT passwordHash, userID FROM User WHERE email = ?'

            connection.query(query, [email], (err, results) => {
                
                if (err) {
                    return reject({statusCode: 500, message: `Database query error: ${err.sqlMessage}`});
                }

                if (results.length === 0) {
                    return reject({statusCode: 404, message: 'User not found'});
                }

                const {passwordHash, userID} = results[0];
                bcrypt.compare(password, passwordHash, (err, isMatch) => {
                    if (err) {
                        return reject({statusCode: 400, message: 'Error checking password'});
                    }

                    if (isMatch) {
                        return resolve({statusCode: 200, Authorization: `Bearer ${generateToken(userID)}`});
                    } else {
                        return reject({statusCode: 401, message: 'Invalid login'});
                    }
                });
            });
        });
    }

    getUserDetails() {
        return new Promise((resolve, reject) => {
            let query = "SELECT userPhoto, userBio, userName FROM User WHERE userID = ?";
            connection.query(query, [this.#userID], (err, results) => {
                
                if (err) {
                    return reject({statusCode: 400, message: `Database query error: ${err.sqlMessage}`})
                }

                if (results.length === 0){
                    return reject({statusCode: 404, message: 'User not found'})
                }

                const {userPhoto, userBio, userName} = results[0]
                return resolve({statusCode: 200, userPhoto: userPhoto, userBio: userBio, userName: userName})

            })
        })
    }

    getUserFunds(){
        return new Promise((resolve, reject) => {
            let query = "SELECT userFundsAmount FROM User WHERE userID = ?"
            connection.query(query, [this.#userID], (err, results) => {
                if (err) {
                    return reject({statusCode: 400, message: `Database query error: ${err.sqlMessage}`})
                }

                if (results.length === 0){
                    return reject({statusCode: 404, message: 'User not found'})
                }

                const {userFundsAmount} = results[0]
                return resolve({statusCode: 200, userFundsAmount: userFundsAmount})
            })
        })
    }

    getUserInterests(){
        return new Promise((resolve, reject) => {
            let query = "SELECT tagID FROM Interest_bridge WHERE userID = ?"
            connection.query(query, [this.#userID], (err, results) => {
                if (err) reject({statusCode: 400, message: `Database query error: ${err.sqlMessage}`});
                if (results.length === 0) reject({statusCode: 404, message: 'No record found'});
                resolve({statusCode: 200, data: results.map(interest => interest.tagID)})
            })
        })
    }

    deleteUser(){
        return new Promise((resolve, reject) => {
            if (ProductList.userIsSeller(this.#userID)){
                const sellerOBJ = new Seller()
                sellerOBJ.setSellerID(this.#userID)
                try{
                    sellerOBJ.deleteSeller()
                } catch (error) {
                    return reject({statusCode: 400, message: error.message})
                }
            }

            let query = "DELETE FROM User WHERE userID = ?"
            connection.query(query, [this.#userID], (err, results) => {
                if (err) {
                    return reject({statusCode: 400, message: `Database query error: ${err.sqlMessage}`})
                }
                return resolve({statusCode: 202, message: 'User Deleted'})
            })
        })
    }


    async updateUser(valuesDict) {
        return new Promise(async (resolve, reject) => {
            // If interests are present in the valuesDict
            if (valuesDict.interests) {
                const interestOBJ = new Interest();
                const usersTagIDs = [];
                try {
                    // Resolve all tag IDs asynchronously
                    for (const interestTag of valuesDict.interests) {
                        const tagID = await interestOBJ.findTagID(interestTag);
                        usersTagIDs.push(tagID.data);
                    }
    
                    // Delete existing interests from the Interest_bridge table for the current user
                    const purgeUserInterestsQuery = "DELETE FROM Interest_bridge WHERE userID = ?";
                    await connection.query("SET SQL_SAFE_UPDATES = 0");
                    await new Promise((resolve, reject) => {
                        connection.query(purgeUserInterestsQuery, [this.#userID], (err, results) => {
                            if (err) return reject(err);
                            resolve(results);
                        });
                    });
                    await connection.query("SET SQL_SAFE_UPDATES = 1");

                    const insertQuery = "INSERT INTO Interest_bridge (userID, tagID) VALUES (?, ?)";
                    for (const interestID of usersTagIDs){
                        await new Promise((resolve, reject) => {
                            connection.query(insertQuery, [this.#userID, interestID], (err, results) => {
                                if (err) return reject(err);
                                resolve(results);
                            });
                        });
                    }                     
                    
                } catch (err) {
                    return reject({statusCode: 400, message: `Error processing interests: ${err.message}`});
                }
    
                // Remove interests from the update object to proceed with other fields
                delete valuesDict.interests;
            }
    
            // Prepare the update query for other user fields (e.g., password, name, etc.)
            let query = "UPDATE User SET ";
            const updates = [];
            const valuesList = [];
    
            for (let field in valuesDict) {
                if (field == 'password') {
                    updates.push("passwordHash = ?");
                    valuesList.push(bcrypt.hashSync(valuesDict[field], SALT_ROUNDS));
                } else {
                    updates.push(`${field} = ?`);
                    valuesList.push(valuesDict[field]);
                }
            }
    
            query += updates.join(', ') + " WHERE userID = ?";
            valuesList.push(this.#userID);
    
            // Execute the final update query for user fields
            connection.query(query, valuesList, (err, results) => {
                if (err) {
                    return reject({statusCode: 400, message: `Database query error: ${err.sqlMessage}`});
                }
    
                return resolve({statusCode: 202, message: 'Entry updated successfully'});
            });
        });
    }
    

    updateFunds(newFunds){
        return new Promise((resolve, reject) => {
            let query = "UPDATE User SET userFundsAmount = userFundsAmount + ? WHERE userID = ?"
            connection.query(query, [newFunds, this.#userID], (err, results) => {
                if (err){
                    return reject({statusCode: 400, message: `Database query error: ${err.sqlMessage}`})
                }
                return resolve({statusCode: 202, message: 'Entry updated'})
            })
        })
    }



    createUser(email, password){
        return new Promise((resolve, reject) => {
            const query = "INSERT INTO User (email, passwordHash) VALUES (?, ?)"
            password = bcrypt.hash(password, SALT_ROUNDS, (err, hash) => {
                if (err) {
                    return reject({statusCode: 400, message: 'Error hashing password'})
                }

                connection.query(query, [email, hash], (err, results) => {
                    
                    if (err) {
                        return reject({statusCode: 400, message: `Database query error: ${err.sqlMessage}`})
                    }
    
                    return resolve({statusCode: 201, message: 'User Created'})
                }) 
            })
            
        })
    }

    grabWeightedProducts(tagID, amount){
        return new Promise((resolve, reject) => {
            query = "SELECT productID FROM Interest_bridge WHERE tagID = ? LIMIT ?"
            connection.query(query, [tagID, amount], (err, results) => {
                if (err) return reject([]);
                const ProductListOBJ = new ProductList()
                results.forEach(product => {
                    ProductListOBJ.getProduct(product.tagIDs)
                });

            })
        })

    }

    async generateWeightedProductList(amount) {
        const interests = this.getUserInterests();
        const productListOBJ = new ProductList();
    
        // No interests — fallback: fetch any N random products
        if (!interests || interests.length === 0) {
            const fallbackQuery = `SELECT productID FROM Interest_bridge LIMIT ?`;
            return new Promise((resolve, reject) => {
                connection.query(fallbackQuery, [amount], async (err, results) => {
                    if (err) return reject(err);
                    try {
                        const productPromises = results.map(r => productListOBJ.getProduct(r.productID));
                        const products = await Promise.all(productPromises);
                        const uniqueProducts = Array.from(new Map(products.map(p => [p.productID, p])).values());
                        shuffle(uniqueProducts);
                        resolve(uniqueProducts.slice(0, amount));
                    } catch (err) {
                        reject(err);
                    }
                });
            });
        }
    
        // Interests exist — fetch weighted products for each interest
        const productsPerInterest = Math.trunc(amount / interests.length);
        const interestQuery = `SELECT productID FROM Interest_bridge WHERE tagID = ? LIMIT ?`;
    
        const allProductsNested = await Promise.all(
            interests.map(interest => {
                return new Promise((resolve, reject) => {
                    connection.query(interestQuery, [interest, productsPerInterest], async (err, results) => {
                        if (err) return reject(err);
                        try {
                            const productPromises = results.map(r => productListOBJ.getProduct(r.productID));
                            const products = await Promise.all(productPromises);
                            resolve(products);
                        } catch (err) {
                            reject(err);
                        }
                    });
                });
            })
        );
    
        // Flatten, deduplicate, shuffle, and trim
        const allProducts = allProductsNested.flat();
        const uniqueProducts = Array.from(new Map(allProducts.map(p => [p.productID, p])).values());
        shuffle(uniqueProducts);
        return uniqueProducts.slice(0, amount);
    }
    
    
}

module.exports = {User};
