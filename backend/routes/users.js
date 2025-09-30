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
    const userObj = new User();
    userObj.setUserID(req.params.userID)
    try {
        const result = await userObj.getUserDetails()
        return res.status(result.statusCode).json(result)
    } catch (error) {
        return res.status(400).send(error.message)
    }
});

router.delete("/:userID", validateDeleteUser, async (req, res) => {
    // body has None
    const userObj = new User();
    userObj.setUserID(req.params.userID)
    try {
        const result = await userObj.deleteUser()
        return res.status(result.statusCode).json(result)
    } catch (error) {
        console.log(error)
        return res.status(400).send(error.message)
    }
});

router.patch("/:userID", validatePostUser, async (req, res) => {
    // body has 1..* user properties
    const userObj = new User();
    userObj.setUserID(req.params.userID)
    try {
        const result = await userObj.updateUser(req.body)
        return res.status(result.statusCode).json(result)
    } catch (error) {
        return res.status(400).send(error.message)
    }
});

router.put("/create", validatePutUser, async (req, res) => {
    // body has [email, password]
    const userObj = new User();
    try {
        const result = await userObj.createUser(req.body.email, req.body.password)
        return res.status(result.statusCode).json(result)
    } catch (error) {
        return res.status(400).send(error.message)
    }

});

module.exports = router;