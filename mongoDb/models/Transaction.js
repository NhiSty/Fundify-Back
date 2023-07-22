const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  transactionId: {
    types: Number,
    required: true,
    unique: true,
  },
  merchantId: {
    types: Number,
    required: true,
  },
  userId: {
    types: Number,
    required: true,
  },
  amount: {
    types: Number,
    required: true,
  },
  currency: {
    types: String,
    required: true,
  },
  status: {
    types: String,
    enum: ['PENDING', 'CONFIRMED', 'CANCELLED'],
    default: 'PENDING',
  },
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
