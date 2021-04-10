const express = require('express');
const PaymentController = require('../controllers/Payments');

const router = express.Router();
const payments = new PaymentController();

router.post('/mobile_money', payments.payWithMobileMoney);

module.exports = router;
