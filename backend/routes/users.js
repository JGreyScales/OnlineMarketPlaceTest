const { User, } = require("../controllers/userController");
const {validateDeleteUser, validatePostUser, validateGetUser, validatePutUser} = require('../validation/validateUser')
const {getUserIDFromToken} = require('../middleware/auth')
const express = require('express');
const router = express.Router();

// doesnt use a middleware for password authentication
router.post("/authenticate", async (req, res) => {
    console.log("authenticate ran")
    // body has [email, password]
    if (!req.body || !req.body.email || !req.body.password) {
        return res.status(400).json({error: 'Malformed data'});
    }

    const userOBJ = new User();
    try {
        const result = await userOBJ.authenticateUser(req.body.email, req.body.password);
        return res.status(result.statusCode).json(result);
    } catch (error) {
        console.log(error)
        return res.status(error.statusCode).send(error.message);
    }
});

router.get("/fund", validateGetUser, async (req, res) => {
    console.log("funds ran")

    // body has None
    const userOBJ = new User();
    userOBJ.setUserID(await getUserIDFromToken(req))
    try {
        const result = await userOBJ.getUserFunds()
        return res.status(result.statusCode).json(result)
    } catch (error) {
        return res.status(400).send(error.message)
    }
});

router.get("/interestList", validateGetUser, async (req, res) => {
    console.log("interestList ran")

    const userOBJ = new User();
    userOBJ.setUserID(await getUserIDFromToken(req))
    try {
        const result = await userOBJ.getUserInterests()
        return res.status(result.statusCode).json(result)
    } catch (error) {
        return res.status(error.statusCode).send(error.message)
    }
})

router.get("/:userID", validateGetUser, async (req, res) => {
    console.log("get user ran")

    // body has None
    const userOBJ = new User();
    if (req.params.userID === 'home') {userOBJ.setUserID(await getUserIDFromToken(req))}
    else {userOBJ.setUserID(req.params.userID)}
    try {
        const result = await userOBJ.getUserDetails()
        return res.status(result.statusCode).json(result)
    } catch (error) {
        return res.status(400).send(error.message)
    }
});

router.get("/weightedStorePage/:amount", validateGetUser, async (req, res) => {
    console.log("get weighted storepage ran")
    const userOBJ = new User();
    userOBJ.setUserID(await getUserIDFromToken(req))
    try {
        const result = await userOBJ.generateWeightedProductList(req.params.amount)
        return res.status(result.statusCode).json(result)
    } catch (error) {
        return res.status(400).send(error.message)
    }
})

router.delete("/", validateDeleteUser, async (req, res) => {
    console.log("delete user ran")
    // body has None
    const userOBJ = new User();
    userOBJ.setUserID(await getUserIDFromToken(req))
    try {
        const result = await userOBJ.deleteUser()
        return res.status(result.statusCode).json(result)
    } catch (error) {
        console.log(error)
        return res.status(400).send(error.message)
    }
});

router.patch("/", validatePostUser, async (req, res) => {
    // body has 1..* user properties
    console.log("update user ran")
    if (req.body.userFundsAmount) {
        return res.status(401).send("Not allowed to modify funds like this")
    }

    const userOBJ = new User();
    userOBJ.setUserID(await getUserIDFromToken(req))
    try {
        const result = await userOBJ.updateUser(req.body)
        return res.status(result.statusCode).json(result)
    } catch (error) {
        return res.status(400).send(error.message)
    }
});

router.patch("/fund", validatePostUser, async (req, res) => {
    console.log("update funds ran")

    // body has fundsAmount
    const userOBJ = new User();
    userOBJ.setUserID(await getUserIDFromToken(req))
    if (!req.body.fundsAmount){
        return res.status(400).send('fundsAmount must be present')
    }

    try {
        const result = await userOBJ.updateFunds(parseFloat(req.body.fundsAmount))
        return res.status(result.statusCode).json(result)
    } catch (error) {
        return res.status(400).send(error.message)
    }
});

router.put("/create", validatePutUser, async (req, res) => {
    // body has [email, password]
    console.log("create user ran")
    const userOBJ = new User();
    try {
        const result = await userOBJ.createUser(req.body.email, req.body.password)
        return res.status(result.statusCode).json(result)
    } catch (error) {
        return res.status(400).send(error.message)
    }
});

module.exports = router;