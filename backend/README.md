# Package Requirements
- JEST
- SUPERTEST


## server.js
The main entry point for backend access from the native-react app

# Controllers
- validating data

// all below will use local cookies to grab userID, sellerID

## fundsController.js
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
    - spendMoney
    - AddMoney

## productController.js
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


## sellerController.js
- allow a user to register as a seller
- allow a seller to modify their profile
- allow a product to be removed
- allow a product to be added
- allow the storepage to be fetched

    ### Properties
    - sellerID
    - products

    ### Methods
    - populateObject
    - registerNewSeller
    - modifyProductByID
    - removeProductByID
    - addProduct
    - getsellerID
    - getproducts

## transactionClass.js
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
    - get transactionID
    - get ProductID
    - get priceAmount
    - get productName
    - get date

## transactionController.js
- allows a user to get a transaction chain using one of any (transaction ID, seller ID, user ID, product ID) (if sent by a user, their userID will be used automatically to only filter their)

    ### Properties
    - Transactions

    ### Methods
    - getTransactionById
    - getTransactionsByUserSearch
    - getTransactionsBySellerSearch
    - getTransactionsByProductIDSearch

## userController.js
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
- get productRatings
- post productRatings

## sellers.js
API commands for sellers this includes:
- get storePageDetails
- post storePageDetails
- get sellerID
- delete sellerID
- get products (list)
- post product
- delete product

## users.js
API commands for users this includes:
- get passwordHash
- post passwordHash
- get email
- get id
- delete id
- get name
- post name
- post PFP
- get PFP
- get bio
- post bio
- get funds
- post funds

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
- userID (Primary, Not Null)
- email
- password
- userFundsAmount
- userPhoto
- userBio
- userName
- interestTags

/ Seller
- sellerID (Primary, Not Null)
- userID (Secondary, Not Null) // the userID of the seller
- Products (list of ID's)
- storepageBio
- storepagePhoto
- storepageName

/ Product
- productID (Primary, Not Null)
- sellerID (Not Null)
- productImage
- productName
- productBio
- productRating (list of bytes)
- updatedAt
- createdAt
- interestTags

/ Transactions
- transactionID (Primary, Not Null, Automatic counting)
- userID 
- sellerID
- productID
- priceAmount
- productName
- date

userID -> SellerID -> Products (list) -> ProductID (from list) -> ProductID

ProductID -> ProductSellerID -> SellerID -> userID