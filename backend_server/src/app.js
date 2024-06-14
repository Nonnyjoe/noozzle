const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const transactionsRouter = require('./routes/transactions/transactions.router');

const app = express();

app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

app.use('/transactions', transactionsRouter);

module.exports = app;