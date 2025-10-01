const db = require('../models/db')
const {validateDeleteInterest, validatePutInterest, validateGetInterest} = require('../validation/validateInterest')
const {Interest} = require("../controllers/interestController")

const express = require("express");
const router = express.Router();

router.get("/:interestHalfFilled", validateGetInterest, async (req, res) => {
    const InterestObj = new Interest()
    try {
        const result = await InterestObj.autocompleteInterest(req.params.interestHalfFilled)
        return res.status(result.statusCode).json(result)
    } catch (error) {
        return res.status(400).send(error.message)
    }
})

router.put("/link/product", validatePutInterest, async (req, res) => {
    // bodyContains [tagID, productID, sellerID]
    if (Interest.objectTagCount(req.body.productID, 'productID') >= Interest.MAX_LINKED_INTERESTS){
        return res.status(401).send("Too many tags already linked")
    }

    const InterestObj = new Interest()
    try {
        const result = await InterestObj.linkTag({tagID: req.body.tagID, productID: req.body.productID, sellerID: req.body.sellerID})
        return res.status(result.statusCode).json(result)
    } catch (error) {
        return res.status(400).send(error.message)
    }
    
})

router.put("/link/user", validatePutInterest, async (req, res) => {
    // bodyContains [tagID, userID]
    if (Interest.objectTagCount(req.body.userID, 'userID') >= Interest.MAX_LINKED_INTERESTS){
        return res.status(401).send("Too many tags already linked")
    }


    const InterestObj = new Interest()
    try {
        const result = await InterestObj.linkTag({tagID: req.body.tagID, userID: req.body.userID})
        return res.status(result.statusCode).json(result)
    } catch (error) {
        return res.status(400).send(error.message)
    }
})

router.delete("/link/product/:tagID", validateDeleteInterest, async (req, res) => {
    // bodyContains [productID]
    const InterestObj = new Interest()
    try {
        const result = await InterestObj.delinkTag(req.params.tagID, req.body.productID, 'productID')
        return res.status(result.statusCode).json(result)
    } catch (error) {
        return res.status(400).send(error.message)
    }
})

router.delete("/link/user/:tagID", validateDeleteInterest, async (req, res) => {
    // bodyContains [userID]
    const InterestObj = new Interest()
    try {
        const result = await InterestObj.delinkTag(req.params.tagID, req.body.userID, 'userID')
        return res.status(result.statusCode).json(result)
    } catch (error) {
        return res.status(400).send(error.message)
    }
})


module.exports = router;