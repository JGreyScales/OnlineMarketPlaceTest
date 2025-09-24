const {Transaction} = require('./transactionClass')

class TransactionList {
    #transactions

    constructor(){}
    getTransactions(){}
    getTransactionsByID(){}
    getTransactionsByUserSearch(){}
    getTransactionsBySellerSearch(){}
    getTransactionsByProductIDSearch(){}
}

module.exports = {TransactionList};