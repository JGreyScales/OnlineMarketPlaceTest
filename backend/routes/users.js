const { User } = require("../controllers/userController");
const {validateDeleteUser, validatePostUser, validateGetUser} = require('../validation/validateUser')

const express = require('express');
const router = express.Router();

// doesnt use a middleware for password authentication
router.get("/:userID/authenticate", (req, res) => {
    
    res.send("BOOL");
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