const { User, } = require("../controllers/userController");
const {validateDeleteUser, validatePostUser, validateGetUser, validatePutUser} = require('../validation/validateUser')

const express = require('express');
const router = express.Router();

// doesnt use a middleware for password authentication
router.post("/authenticate", async (req, res) => {
    // body has [email, password]
    if (!req.body || !req.body.email || !req.body.password) {
        return res.status(400).json({error: 'Malformed data'});
    }

    const userOBJ = new User();
    try {
        const result = await userOBJ.authenticateUser(req.body.email, req.body.password);
        return res.status(result.statusCode).json(result);
    } catch (error) {
        return res.status(400).send(error.message);
    }
});



router.get("/:userID", validateGetUser, async (req, res) => {
    // body has None
    const userOBJ = new User();
    userOBJ.setUserID(req.params.userID)
    try {
        const result = await userOBJ.getUserDetails()
        return res.status(result.statusCode).json(result)
    } catch (error) {
        return res.status(400).send(error.message)
    }
});

router.get("/:userID/funds", validateGetUser, async (req, res) => {
    // body has None
    const userOBJ = new User();
    userOBJ.setUserID(req.params.userID)
    try {
        const result = await userOBJ.getUserFunds()
        return res.status(result.statusCode).json(result)
    } catch (error) {
        return res.status(400).send(error.message)
    }
});

router.get("/:userID/interestList", validateGetUser, async (req, res) => {
    const userOBJ = new User();
    userOBJ.setUserID(req.params.userID)
    try {
        const result = await userOBJ.getUserInterests()
        return res.status(result.statusCode).json(result)
    } catch (error) {
        return res.status(400).send(error.message)
    }
})

router.delete("/:userID", validateDeleteUser, async (req, res) => {
    // body has None
    const userOBJ = new User();
    userOBJ.setUserID(req.params.userID)
    try {
        const result = await userOBJ.deleteUser()
        return res.status(result.statusCode).json(result)
    } catch (error) {
        console.log(error)
        return res.status(400).send(error.message)
    }
});

router.patch("/:userID", validatePostUser, async (req, res) => {
    // body has 1..* user properties
    if (req.body.userFundsAmount) {
        return res.status(401).send("Not allowed to modify funds like this")
    }
    const userOBJ = new User();
    userOBJ.setUserID(req.params.userID)
    try {
        const result = await userOBJ.updateUser(req.body)
        return res.status(result.statusCode).json(result)
    } catch (error) {
        return res.status(400).send(error.message)
    }
});

router.patch("/:userID/fund", validatePostUser, async (req, res) => {
    // body has fundsAmount
    const userOBJ = new User();
    userOBJ.setUserID(req.params.userID)
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
    const userOBJ = new User();
    try {
        const result = await userOBJ.createUser(req.body.email, req.body.password)
        return res.status(result.statusCode).json(result)
    } catch (error) {
        return res.status(400).send(error.message)
    }
});

module.exports = router;