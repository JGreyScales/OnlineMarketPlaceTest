const {Funds} = require("./fundsController")

class User {
    #userID
    #funds
    #interests
    #cart
    MAX_EMAIL_LENGTH = 40;
    MAX_PASSWORD_LENGTH = 256;
    MAX_BIO_LENGTH = 250;
    MAX_USERNAME_LENGTH = 20;

    constructor(){}

    getUserID(){}
    getFunds(){}
    getInterest(){}
    addToCart(){}
    removeFromCartByID(){}
    purchaseCart(){}    
}

module.exports = {User};