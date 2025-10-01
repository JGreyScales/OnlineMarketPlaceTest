const { ProductList } = require("../controllers/Product/product");
const {validateDeleteProduct, validatePostProduct, validateGetProduct} = require('../validation/validateProduct')
const { getUserIDFromToken } = require("../middleware/auth")
const db = require('../models/db')

const express = require("express");
const router = express.Router();

router.get("/:productID", validateGetProduct, async (req, res) => {
    const productListOBJ = new ProductList()
    try {
        const result = await productListOBJ.getProduct(req.params.productID)
        return res.status(result.statusCode).json(result)
    } catch (error) {
        console.log(error)
        return res.status(400).send(error.message)
    }
});

router.put("/create", validatePostProduct, async (req, res) => {
    // body contains [productName, productImage, productBio, productPrice]
    req.body.sellerID = getUserIDFromToken(req) // add sellerID to the body
    const productListOBJ = new ProductList()
    if (productListOBJ.userIsSeller(req.body.sellerID)){
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

router.put("/:productID/purchase", validatePostProduct, async(req, res) => {
    //
})


router.delete("/:productID", validateDeleteProduct, async (req, res) => {
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
    // body contains [productName, productImage, productBio, productPrice]
    const productListOBJ = new ProductList()
    try {
        const result = await productListOBJ.patchProduct(req.body, req.params.productID)
        return res.status(result.statusCode).json(result)
    } catch (error) {
        return res.status(400).send(error.message)
    }
});

router.post("/:productID/rating", validatePostProduct, async (req, res) => {
    // body contains [rating]
    const userID = getUserIDFromToken(req);
    const productListOBJ = new ProductList()
    try {
        const result = await productListOBJ.createProductRating(req.params.productID, req.body.rating, userID)
        return res.status(result.statusCode).json(result)
    } catch (error) {
        return res.status(400).send(error.message)
    }
});

module.exports = router;