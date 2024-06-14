const express = require('express');
const {httpAddnewTransaction} = require('./transactions.controller');

const transactionsRouter = express.Router();

transactionsRouter.post('/', httpAddnewTransaction);


module.exports = transactionsRouter;