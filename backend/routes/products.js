const { ProductList } = require("../controllers/Product/product");
const {validateDeleteProduct, validatePostProduct, validateGetProduct} = require('../validation/validateProduct')
const { getUserIDFromToken } = require("../middleware/auth")
const db = require('../models/db')

const express = require("express");
const router = express.Router();

router.get("/:productID/purchase", validateGetProduct, async(req, res) => {
    console.log("ran purchase product")
    const buyerID = await getUserIDFromToken(req)
    const productListOBJ = new ProductList()
    try {
        const result = await productListOBJ.purchaseProduct(buyerID, req.params.productID)
        return res.status(result.statusCode).json(result)
    } catch (error){
        return res.status(error.statusCode || 400).send(error.message)
    }
})

router.get("/:productID", validateGetProduct, async (req, res) => {
    console.log("get product by ID")
    const productListOBJ = new ProductList()
    try {
        const result = await productListOBJ.getProduct(req.params.productID)
        return res.status(result.statusCode).json(result)
    } catch (error) {
        return res.status(400).send(error.message)
    }
});



router.put("", validatePostProduct, async (req, res) => {
    console.log("create product ran")
    // body contains [productName, productImage, productBio, productPrice]
    req.body.sellerID = await getUserIDFromToken(req) // add sellerID to the body
    const productListOBJ = new ProductList()
    if (await productListOBJ.userIsSeller(req.body.sellerID)){
        try {
            const result = await productListOBJ.createProduct(req.body)
            return res.status(result.statusCode).json(result)
        } catch (error) {
            console.log(error)
            return res.status(400).send(error.message)
        }
    } else {
        return res.status(404).send("user is not a seller")
    }
});


router.delete("/:productID", validateDeleteProduct, async (req, res) => {
    console.log("delete product ran")
    const productListOBJ = new ProductList()
    try {
        const result = await productListOBJ.deleteProduct(req.body.productID)
        return res.status(result.statusCode).json(result)
    } catch (error) {
        console.log(error)
        return res.status(400).send(error.message)
    }
});

router.patch("/:productID", validatePostProduct, async (req, res) => {
    console.log("update product ran")
    // body contains [productName, productImage, productBio, productPrice, productInterests]
    // contains 0..*
    const productListOBJ = new ProductList()
    const sellerID = await getUserIDFromToken(req)
    try {
        const result = await productListOBJ.patchProduct(req.body, parseInt(req.params.productID), sellerID)
        return res.status(result.statusCode).json(result)
    } catch (error) {
        return res.status(400).send(error.message)
    }
});

router.post("/:productID/rating", validatePostProduct, async (req, res) => {
    console.log("rate product ran")
    // body contains [rating]
    const userID = await getUserIDFromToken(req);
    const productListOBJ = new ProductList()
    try {
        const result = await productListOBJ.createProductRating(parseInt(req.params.productID), parseInt(req.body.rating), userID)
        return res.status(result.statusCode).json(result)
    } catch (error) {
        return res.status(400).send(error.message)
    }
});

module.exports = router;