const { User } = require("../controllers/userController");

const express = require('express');
const router = express.Router();

router.get("/:userID/authenticate", (req, res) => {
    res.send("BOOL");
});

router.get("/:userID", (req, res) => {
    // if res.param.userID != res.body.userID, do not populate funds
    res.send("USER OBJECT");
});

router.delete("/:userID", (req, res) => {
    res.sendStatus(202).end();
});

router.post("/:userID", (req, res) => {
    res.sendStatus(201).end();
});

module.exports = router;