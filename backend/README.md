MVC-style preplanning below

# Package Requirements
- JEST
- SUPERTEST
- bcrypt 
- dotenv
- express
- multer
- mysql
- jsonwebtoken


## server.js
The main entry point for backend access from the native-react app

# Controllers
- validating data

// all below will use local cookies to grab userID, sellerID

## fundsController.js - Funds
- allow the user to spend money
- allow the user to add money

    ### Properties
    - userID
    - fundsAmount

    ### Methods
    - populateObject
    - getUserID
    - getFundsAmount
    - inquireFundsAmount
    - removeMoney
    - addMoney

## productController.js - Product
- allow the product to be displayed
- allow the product to be purchased
- allow a product to be modified

 
    ### Properties
    - productID
    - sellerID
    - productImage
    - productName
    - productBio
    - productRating
    - updatedAt
    - createdAt
    - interestTags

    ### Methods
    - populateObject
    - populatePreviewObject
    - inquireProductByID
    - inquireProductsBySellerID
    - getproductID
    - getSellerID
    - getProductImage
    - getProductName
    - getProductBio
    - getProductRating
    - getUpdatedAt
    - getCreatedAt
    - getInterestTags

## products.js - ProductList
- is used for storePageDetails when fetching randomized products
    ### Properties
    - Products

    ### Methods
    - populateList(optional, seller id)
    - getProductList


## sellerController.js - Seller
- allow a user to register as a seller
- allow a seller to modify their profile
- allow a product to be removed
- allow a product to be added
- allow the storepage to be fetched

    ### Properties
    - sellerID
    - ProductList

    ### Methods
    - populateObject
    - registerNewSeller
    - modifyProductByID
    - removeProductByID
    - addProduct
    - getsellerID
    - getproducts

## transactionClass.js - Transaction
- used to process indidivual transactions

    ### Properties
    - transactionID
    - sellerId
    - productID
    - priceAmount
    - productName
    - date

    ### Methods
    - populateObjectFromProductID
    - gettransactionID
    - getProductID
    - getPriceAmount
    - getProductName
    - getDate

## transactionController.js - TransactionList
- allows a user to get a transaction chain using one of any (transaction ID, seller ID, user ID, product ID) (if sent by a user, their userID will be used automatically to only filter their results)

    ### Properties
    - Transactions

    ### Methods
    - getTransactions
    - getTransactionById
    - getTransactionsByUserSearch
    - getTransactionsBySellerSearch
    - getTransactionsByProductIDSearch

## userController.js - User
- allows a user to browse products based on interest tags
- allow the user to select a random product from a random seller
- allow a user to modify their settings
- allow a user to modify their profile

    ### Properties
    - userID
    - funds
    - interests
    - cart

    ### Methods
    - getUserId
    - getFunds
    - getInterests
    - addToCart
    - removeFromCartById
    - purchaseCart

# Middleware
## auth.js
- API authentication requests using JWT

# Routes
## products.js
API commands for products this includes:
- get product
- post productDetails (image + bio + name + createdAt + modifiedAt)
- post productRatings
- post product
- delete product


## sellers.js
API commands for sellers this includes:
- get storePageDetails
- post storePageDetails
- get sellerID
- delete sellerID
- get products (list)

## users.js
API commands for users this includes:
- get authenticateUser
- get user
- delete user
- post user
## transactions.js
- get purchaseHistory (takes a single ID, this can be a product, transaction, user, or seller id)

# Models
## db.js
- Database connection info

# validation
## validateUser.js
- ensures user information is validated & sanitized during transport both ways

## validateSeller.js
- ensures seller information is validated & sanitized during transport both ways

## validateProduct.js
- ensures product information is validated & sanitized during transport both ways

## validateTransaction.js
- ensures product information is validated & sanitized during transport both ways

// database schema connection path

/ User
- userID (Primary, Not Null) (unsigned mediumint)
- email (varchar(40))
- password (varchar(256))
- userFundsAmount (Decimal) # for fixed-point precision
- userPhoto (LONGBLOB)
- userBio (varchar(250))
- userName (varchar(20))

/ Seller
- sellerID (Primary, Not Null) (unsigned mediumint)
- storepageBio (varchar(500))
- storepagePhoto (BLOB)
- storepageName (varchar(25))

/ Products
- productID (Primary, Not Null) (unsigned mediumint)
- sellerID (Not Null) (unsigned mediumint)
- productImage (LONGBLOB)
- productName (varchar(20))
- productBio (varchar(1000))
- productPrice (Decimal(10,2))
- updatedAt (DATE)
- createdAt (DATE)

/ Interests
- tag (varchar(20))
- tagID (unsigned mediumint)

/ Interest_Bridge
- tagID (unsigned mediumint) (not nullable)
- productID (unsigned mediumint) (nullable)
- userID (unsigned mediumint) (nullable)
- sellerID (unsigned mediumint) (nullable)

/ Ratings
- productID (unsigned mediumint)
- rating (tinyint(5))
- userID (unsigned mediumint)
- verifiedBuyer (bool)

/ Transactions
- transactionID (unsigned bigint)(Primary, Not Null, Automatic counting)
- userID (unsigned mediumint)
- sellerID (unsigned mediumint)
- productID (unsigned mediumint)
- priceAmount (decimal)
- productName (varchar(20))
- date (DATE)

userID -> SellerID -> Products (list) -> ProductID (from list) -> ProductID

ProductID -> ProductSellerID -> SellerID -> userID