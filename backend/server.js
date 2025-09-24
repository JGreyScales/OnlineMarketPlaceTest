const user = require('./routes/users');
const transaction = require("./routes/transactions");
const seller = require("./routes/sellers");
const product = require("./routes/products");

const express = require('express');
const app = express();

app.use(express.json()); // use json for incoming payloads


app.use("/user", user);
app.use("/transaction", transaction);
app.use("/seller", seller);
app.use("/product", product);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});