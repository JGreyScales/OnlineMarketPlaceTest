const { TransactionList } = require('../controllers/Transactions/transactionController');
const {validateGetTransaction} = require('../validation/validateTransaction')
const express = require('express');
const router = express.Router();


router.get("/user/:userID", validateGetTransaction, async (req, res) => {
    console.log("get transactions from userID ran")
    const transactionListOBJ = new TransactionList()
    try {
        const result = await transactionListOBJ.getTransaction(req.params.userID, "userID")
        return res.status(result.statusCode).json(result)
    } catch (error) {
        return res.status(400).send(error.message)
    }
});

router.get("/seller/:sellerID", validateGetTransaction,  async (req, res) => {
    console.log("get transactions from sellerID ran")
    const transactionListOBJ = new TransactionList()
    try {
        const result = await transactionListOBJ.getTransaction(req.params.userID, "sellerID")
        return res.status(result.statusCode).json(result)
    } catch (error) {
        return res.status(400).send(error.message)
    }
});

router.get("/product/:productID", validateGetTransaction, async (req, res) => {
    console.log("get transaction from ProductID")
    const transactionListOBJ = new TransactionList()
    try {
        const result = await transactionListOBJ.getTransaction(req.params.userID, "productID")
        return res.status(result.statusCode).json(result)
    } catch (error) {
        return res.status(400).send(error.message)
    }
});

router.get("/:transID", validateGetTransaction, async (req, res) => {
    console.log("get transaction from ID ran")
    const transactionListOBJ = new TransactionList()
    try {
        const result = await transactionListOBJ.getTransaction(parseInt(req.params.transID), "transactionID")
        return res.status(result.statusCode).json(result)
    } catch (error) {
        return res.status(400).send(error.message)
    }
});

module.exports = router;