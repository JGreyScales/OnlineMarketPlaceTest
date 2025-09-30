const bcrypt = require("bcrypt")
const {generateToken, authenticateToken} = require('../middleware/auth')
const connection = require("../models/db")
const SALT_ROUNDS = 14;

class User {
    #userID
    #interests
    MAX_EMAIL_LENGTH = 40;
    MAX_PASSWORD_LENGTH = 256;
    MAX_BIO_LENGTH = 250;
    MAX_USERNAME_LENGTH = 20;

    constructor() {
        this.#userID = 0
        this.#interests = {}
    }

    setUserID(userID){
        this.#userID = userID
    }

    authenticateUser(email, password) {
        return new Promise((resolve, reject) => {
            let query = 'SELECT passwordHash, userID FROM User WHERE email = ?'

            connection.query(query, [email], (err, results) => {
                
                if (err) {
                    console.log(err)
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
                    console.log(err)
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
                    console.log(err)
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
        
    }

    deleteUser(){
        return new Promise((resolve, reject) => {
            let query = "DELETE FROM User WHERE userID = ?"
            connection.query(query, [this.#userID], (err, results) => {
                
                if (err) {
                    console.log(err)
                    return reject({statusCode: 400, message: `Database query error: ${err.sqlMessage}`})
                }
                return resolve({statusCode: 202, message: 'Entry queued for removal'})
            })
        })
    }

    updateUser(values){
        return new Promise((resolve, reject) => {
            let query = "UPDATE User SET "
            const updates = []
            const valuesList = []

            for (let field in values){
                if (field == 'password'){
                    updates.push("passwordHash = ?")
                    valuesList.push(bcrypt.hashSync(values[field], SALT_ROUNDS))
                } else {
                    updates.push(`${field} = ?`)
                    valuesList.push(values[field])
                }

            }

            query += updates.join(', ') + " WHERE userID = ?"
            valuesList.push(this.#userID)
            connection.query(query, valuesList, (err, results) => {
                
                if (err) {
                    console.log(err)
                    return reject({statusCode: 400, message: `Database query error: ${err.sqlMessage}`})
                }

                return resolve({statusCode: 202, message: 'Entry updated'})
            })
        })
    }

    updateFunds(newFunds){
        return new Promise((resolve, reject) => {
            let query = "UPDATE User SET userFundsAmount = userFundsAmount + ? WHERE userID = ?"
            connection.query(query, [newFunds, this.#userID], (err, results) => {
                if (err){
                    console.log(err)
                    return reject({statusCode: 400, message: `Database query error: ${err.sqlMessage}`})
                }
                return resolve({statusCode: 202, message: 'Entry updated'})
            })
        })
    }



    createUser(email, password){
        return new Promise((resolve, reject) => {
            let query = "INSERT INTO User (email, passwordHash) VALUES (?, ?)"
            password = bcrypt.hash(password, SALT_ROUNDS, (err, hash) => {
                if (err) {
                    return reject({statusCode: 400, message: 'Error hashing password'})
                }

                connection.query(query, [email, hash], (err, results) => {
                    
                    if (err) {
                        console.log(err)
                        return reject({statusCode: 400, message: `Database query error: ${err.sqlMessage}`})
                    }
    
                    return resolve({statusCode: 201, message: 'Entry created'})
                }) 
            })
            
        })
    }
}

module.exports = {User};
