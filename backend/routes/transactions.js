const { TransactionList } = require('../controllers/Transactions/transactionController');

const express = require('express');
const router = express.Router();

router.get("/:transID", (req, res) => {
    res.send("SEND TRANSACTION");
});

router.get("/user/:userID", (req, res) => {
    res.send("SEND TRANSACTION LIST");
});

router.get("/seller/:sellerID", (req, res) => {
    res.send("SEND TRANSACTION LIST");
});

router.get("/product/:productID", (req, res) => {
    res.send("SEND TRANSACTION LIST");
});

module.exports = router;