const { User } = require("../controllers/userController");
const {validateDeleteUser, validatePostUser, validateGetUser} = require('../validation/validateUser')
const {generateToken} = require('../middleware/auth')
const connection = require("../models/db")
const bcrypt = require("bcrypt")

const express = require('express');
const router = express.Router();

// doesnt use a middleware for password authentication
router.post("/authenticate", (req, res) => {
    // body has [email, password]
    // hardcoded fact checking
    if (!req.body || !req.body.email || !req.body.password){
        return res.status(400).json({error: `Malformed data`})
    }

    let query = 'SELECT passwordHash, userID FROM User WHERE email = ?'

    connection.query(query, [req.body['email']], (err, results) => {
        if (err) {
            console.error(err.message)
            return res.status(500).json({error: `Database query error`})
        }

        if (results.length === 0) {
            return res.status(404).json({error: `User not found`})
        }

        const {passwordHash, userID} = results[0];
        bcrypt.compare(req.body['password'], passwordHash, (err, isMatch) => {
            if (err) {
                return res.status(400).json({error: `Error checking password`})
            }

            if (isMatch) {
                return res.status(200).json({Authorization: `Bearer ${generateToken(userID)}`})
            } else {
                return res.status(401).json({error: `Invalid login`})
            }
        })
    })
});

router.get("/:userID", validateGetUser, (req, res) => {
    return
});

router.delete("/:userID", validateDeleteUser, (req, res) => {
    res.sendStatus(202).end();
});

router.post("/:userID", validatePostUser, (req, res) => {
    res.sendStatus(201).end();
});

module.exports = router;