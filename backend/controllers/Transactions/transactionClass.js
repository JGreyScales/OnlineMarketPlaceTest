class Transaction {
    #transactionID
    #sellerID
    #productID
    #priceAmount
    #productName
    #date
    MAX_TRANSACTION_NAME_LENGTH = 20;

    constructor(){}

    populateObjectFromProductID(){}
    getTransactionID(){}
    getProductID(){}
    getPriceAmount(){}
    getProductName(){}
    getDate(){}
}

module.exports = {Transaction};