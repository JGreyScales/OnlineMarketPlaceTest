const db = require('../models/db')
const {validateDeleteInterest, validatePutInterest, validateGetInterest} = require('../validation/validateInterest')
const {Interest} = require("../controllers/interestController")

const express = require("express");
const { validatePostUser } = require('../validation/validateUser');
const { getUserIDFromToken } = require('../middleware/auth');
const router = express.Router();

router.get("/AC/:interestHalfFilled", validateGetInterest, async (req, res) => {
    console.log("ran interest/AC/:interestHalfFilled")
    const InterestObj = new Interest()
    try {
        const result = await InterestObj.autocompleteInterest(req.params.interestHalfFilled)
        return res.status(result.statusCode).json(result)
    } catch (error) {
        return res.status(400).send(error.message)
    }
})

router.post("/tags", validateGetInterest, async (req, res) => {
    console.log("get tag Name from ID ran")
    // bodyContains [tags: List]
    const InterestObj = new Interest()
    const returnData = []
    try {
        for (tagID of req.body.tags) {
            const result = await InterestObj.findTagName(tagID)
            if (result.data) { returnData.push(result.data) }
            
        }
        return res.status(200).json(returnData)
    } catch (error) {
        return res.status(error.statusCode || 400).send(error.message)
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
    // bodyContains [tagID]
    const userID = getUserIDFromToken(req)
    if (Interest.objectTagCount(userID, 'userID') >= Interest.MAX_LINKED_INTERESTS){
        return res.status(401).send("Too many tags already linked")
    }
    const InterestObj = new Interest()
    try {
        const result = await InterestObj.linkTag({tagID: req.body.tagID, userID: userID})
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