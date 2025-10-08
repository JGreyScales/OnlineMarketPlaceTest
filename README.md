# Online Marketplace Testing
A simple project to occupy time.

# Goals
- [x] must allow user to create an account
    - [x] user password must be encrypted
    - [x] user must be able to authenticate with an existing account
    - [x] user must be denied if authentication fails
    - [x] must allow user to delete an account
    - [x] must allow user to modify an account
    - [x] must allow users to view their purchase history
- [X] must allow seller to post a product
    - [X] must allow seller to set a price
    - [X] must allow seller to set a productName
    - [X] must allow seller to set a productBio
    - [ ] must allow seller to set a product image
    - [x] must allow seller to see their selling history
- [x] Users must be allowed to view an entire sellers page
- [x] When a product is sold, the seller should get 0.97x of the profit directly to their user account
- [x] have a mimiced screen for withdrawing money
- [x] must allow user upload "money" to the site
- [x] must allow user to spend their money on the site
- [x] must use the node.JS server for data requests
- [x] must use the MySQL server for data storage
- [x] must use properly formatted folders


Creating Users
![](https://github.com/JGreyScales/OnlineMarketPlaceTest/blob/main/GIFS/create_user.gif)



# Known Issues
- I cant really protect the payment portal from fraud, Ideally I would want to use something like Stripe to offset all that responsability so I dont even need to really handle the users wallet at all. But this is just a demo project so please ignore this oversight







## Codebase stack
Native React frontend

Node.JS backend // maybe use redis for caching

MySQL server storage

JEST testing


### notes

.env files have been revoked for security reasons, the backend, frontend, and MySQL server may have local .env variables that will not be avaliable for public viewing 