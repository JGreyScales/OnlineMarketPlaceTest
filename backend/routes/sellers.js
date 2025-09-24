const { Seller } = require("../controllers/sellerController");

const express = require("express");
const router = express.Router();

router.get("/store/:sellerID", (req, res) => {
    // req.param.productID
    res.send("STORE OBJECT");
});

router.post("/store/:sellerID", (req, res) => {
    // post content in res.body
    res.sendStatus(201).end();
});

router.get("/:sellerID", (req, res) => {
    // req.param.sellerID
    res.send("SELLER OBJECT");
});

router.delete("/:sellerID", (req, res) => {
    res.sendStatus(202).end();
});

router.get("/:sellerID/products", (req, res) => {
    res.send("List of products");
});


module.exports = router;