const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  transactionId: {
    type: Number,
    required: true,
    unique: true,
  },
  merchantId: {
    type: Number,
    required: true,
  },
  userId: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['PENDING', 'CONFIRMED', 'CANCELLED'],
    default: 'PENDING',
  },
});
const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
