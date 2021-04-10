const express = require("express");
require('dotenv').config();

const PaymentsRoute = require('./routes/PaymentsRoute');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/v1/payments', PaymentsRoute);


app.listen(PORT);
