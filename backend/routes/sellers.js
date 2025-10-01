const { Seller } = require("../controllers/sellerController");
const {validateDeleteSeller, validatePostSeller, validateGetSeller} = require('../validation/validateSeller')
const {getUserIDFromToken} = require('../middleware/auth')
const express = require("express");
const router = express.Router();


router.get("/:sellerID", validateGetSeller, async (req, res) => {
    const sellerObj = new Seller()
    if (req.params.sellerID === 'home') {sellerObj.setSellerID(getUserIDFromToken(req))}
    else {sellerObj.setSellerID(req.params.sellerID)}
    try {
        const result = await sellerObj.getSeller()
        return res.status(result.statusCode).json(result)
    } catch (error){
        return res.status(400).send(error.message)
    }
    
});

router.get("/:sellerID/products/:amount", validateGetSeller, async (req, res) => {
    const sellerObj = new Seller()
    if (req.params.sellerID === 'home') {sellerObj.setSellerID(getUserIDFromToken(req))}
    else {sellerObj.setSellerID(req.params.sellerID)}
    try {
        const result = sellerObj.getSellerProducts(req.params.amount)
        return res.status(result.statusCode).json(result)
    } catch (error) {
        return res.status(400).send(error.message)
    }

});

router.put("/create", validatePostSeller, async(req, res) => {
    const sellerObj = new Seller()
    sellerObj.setSellerID(getUserIDFromToken(req))
    try{
        const result = await sellerObj.createSeller()
        return res.status(result.statusCode).json(result)
    } catch (error) {
        return res.status(400).send(error.message)
    }
})

router.patch("/update", validatePostSeller, async (req, res) => {
    // body contains [storepageBio, storepagePhoto, storepageName]
    const sellerObj = new Seller()
    sellerObj.setSellerID(getUserIDFromToken(req))
    try {
        const result = await sellerObj.patchSeller(req.body)
        return res.status(result.statusCode).json(result)
    } catch (error) {
        return res.status(400).send(error.message)
    }
});



router.delete("/delete", validateDeleteSeller, async (req, res) => {
    const sellerOBJ = new Seller()
    sellerOBJ.setSellerID(getUserIDFromToken(req))
    try {
        const result = await sellerObj.deleteSeller()
        return res.status(400).send(error.message)
    } catch (error) {
        return res.status(400).send(error.message)
    }
});




module.exports = router;