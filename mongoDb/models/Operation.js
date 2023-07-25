const mongoose = require('mongoose');

const operationSchema = new mongoose.Schema({
  operationId: {
    type: Number,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    enum: ['TOTAL', 'PARTIAL'],
    default: 'TOTAL',
  },
  amount: {
    type: Number,
    required: true,
  },
  transactionId: {
    type: Number,
    required: true,
  },
});

const Operation = mongoose.model('Operation', operationSchema);

module.exports = Operation;
