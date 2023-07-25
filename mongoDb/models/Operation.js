const mongoose = require('mongoose');

const operationSchema = new mongoose.Schema({
  operationId: {
    type: Number,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    enum: ['captured', 'refunded'],
    default: 'captured',
  },
  amountOperation: {
    type: Number,
    required: true,
  },
  transactionId: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['created', 'processing', 'done', 'failed'],
    default: 'created',
  },
});

const Operation = mongoose.model('Operation', operationSchema);

module.exports = Operation;
