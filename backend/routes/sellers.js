const { Seller } = require("../controllers/sellerController");
const {validateDeleteSeller, validatePostSeller, validateGetSeller} = require('../validation/validateSeller')
const {getUserIDFromToken} = require('../middleware/auth')
const express = require("express");
const router = express.Router();

router.get("/:sellerID/products/:amount", validateGetSeller, async (req, res) => {
    console.log("get x amount of sellers products ran")
    const sellerObj = new Seller()
    if (req.params.sellerID === 'home') {sellerObj.setSellerID(await getUserIDFromToken(req))}
    else {sellerObj.setSellerID(req.params.sellerID)}
    try {
        const result = await sellerObj.getSellerProducts(req.params.amount)
        return res.status(result.statusCode).json(result)
    } catch (error) {
        return res.status(error.statusCode).send(error.message)
    }

});

router.get("/:sellerID", validateGetSeller, async (req, res) => {
    console.log("get seller ran")
    const sellerObj = new Seller()
    if (req.params.sellerID === 'home') {sellerObj.setSellerID(await getUserIDFromToken(req))}
    else {sellerObj.setSellerID(req.params.sellerID)}
    try {
        const result = await sellerObj.getSeller()
        return res.status(result.statusCode).json(result)
    } catch (error){
        return res.status(400).send(error.message)
    } 
});

router.get("/:sellerID/interests", validateGetSeller, async (req, res) => {
    console.log("get seller interests ran")
    const sellerObj = new Seller()
    if (req.params.sellerID === 'home') {sellerObj.setSellerID(await getUserIDFromToken(req))}
    else {sellerObj.setSellerID(req.params.sellerID)}
    try {
        const result = await sellerObj.getSellerInterests()
        return res.status(result.statusCode).json(result)
    } catch (error){
        return res.status(error.statusCode).send(error.message)
    } 
});

router.get("/:sellerID/rating", validateGetSeller, async (req, res) => {
    console.log("get seller rating ran")
    const sellerObj = new Seller()
    if (req.params.sellerID === 'home') {sellerObj.setSellerID(await getUserIDFromToken(req))}
    else {sellerObj.setSellerID(req.params.sellerID)}
    try {
        const result = await sellerObj.getSellerRating()
        return res.status(result.statusCode).json(result)
    } catch (error){
        return res.status(400).send(error.message)
    } 
})



router.put("", validatePostSeller, async(req, res) => {
    console.log('create seller ran')
    const sellerObj = new Seller()
    sellerObj.setSellerID(await getUserIDFromToken(req))
    try{
        const result = await sellerObj.createSeller()
        return res.status(result.statusCode).json(result)
    } catch (error) {
        return res.status(400).send(error.message)
    }
})

router.patch("", validatePostSeller, async (req, res) => {
    console.log('update seller ran')
    // body contains [storepageBio, storepagePhoto, storepageName]
    const sellerObj = new Seller()
    sellerObj.setSellerID(await getUserIDFromToken(req))
    try {
        const result = await sellerObj.patchSeller(req.body)
        return res.status(result.statusCode).json(result)
    } catch (error) {
        return res.status(400).send(error.message)
    }
});



router.delete("", validateDeleteSeller, async (req, res) => {
    console.log('delete seller ran')
    const sellerOBJ = new Seller()
    sellerOBJ.setSellerID(await getUserIDFromToken(req))
    try {
        const result = await sellerObj.deleteSeller()
        return res.status(400).send(error.message)
    } catch (error) {
        return res.status(400).send(error.message)
    }
});




module.exports = router;