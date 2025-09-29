const user = require('./routes/users');
const transaction = require("./routes/transactions");
const seller = require("./routes/sellers");
const product = require("./routes/products");

const express = require('express');
const app = express();

app.use(express.json()); // use json for incoming payloads
app.use((err, req, res, next) => { 
    if (err instanceof multer.MulterError) { // handles errors coming from multer file validation
      return res.status(400).send({ message: 'File upload error', error: err.message });
    }
    if (err) { // generalized validation error
      return res.status(400).send({ message: 'Validation error', error: err.message });
    }
    next();
  });



app.use("/user", user);
app.use("/transaction", transaction);
app.use("/seller", seller);
app.use("/product", product);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});