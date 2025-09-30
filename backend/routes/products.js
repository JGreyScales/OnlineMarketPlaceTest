const { ProductList } = require("../controllers/Product/product");
const db = require('../models/db')

const express = require("express");
const router = express.Router();

router.get("/:productID", async (req, res) => {
    const productListOBJ = new ProductList()
    try {
        const result = await productListOBJ.getProduct(req.params.productID)
        return res.status(result.statusCode).json(result)
    } catch (error) {
        console.log(error)
        return res.status(400).send(error.message)
    }
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