const cors = require('cors');
const user = require('./routes/users');
const transaction = require("./routes/transactions");
const seller = require("./routes/sellers");
const product = require("./routes/products");
const interest = require("./routes/interests");

require('dotenv').config({ quiet: true }); // load the .env file into memory

const express = require('express');
const app = express();

const corsOptions = {
    origin: '*', // Allow all origins
};
app.use(cors(corsOptions));


app.use(express.json()); // use json for incoming payloads

app.use("/user", user);
app.use("/transaction", transaction);
app.use("/seller", seller);
app.use("/product", product);
app.use("/interest", interest);

const PORT = process.env.PORT || 3000;
// listen on all network intefaces
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
