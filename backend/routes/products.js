const { Product } = require("../controllers/Product/productController");
const db = require('../models/db')

const express = require("express");
const router = express.Router();

router.get("/:productID", (req, res) => {
    res.send("PRODUCT OBJECT");
});

router.post("/create", (req, res) => {
    res.sendStatus(201).end();
});


router.delete("/:productID", (req, res) => {
    res.sendStatus(202).end();
});

router.post("/:productID", (req, res) => {
    res.sendStatus(202).end();
});

router.post("/:productID/rating", (req, res) => {
    res.sendStatus(201).end();
});

module.exports = router;