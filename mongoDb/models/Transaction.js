const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true,
  },
  merchantId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  operations: [
    {
      operationId: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        enum: ['capture', 'refund', 'authorization'],
        default: 'capture',
      },
      amount: {
        type: Number,
        required: true,
      },
      status: {
        type: String,
        enum: ['created', 'processing', 'done', 'failed'],
        default: 'created',
      },
      statusHist: [
        {
          status: {
            type: String,
            enum: ['created', 'processing', 'done', 'failed'],
          },
          date: {
            type: Date,
            default: Date.now,
          },
        },
      ],
    },
  ],
  statusHist: [
    {
      status: {
        type: String,
        enum: ['created', 'captured', 'authorized', 'waiting_refund', 'partial_refunded', 'refunded', 'cancelled'],
        default: 'created',
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  amount: {
    type: Number,
    required: true,
  },
  outstandingBalance: {
    type: Number,
    required: true,
  },
  refundAmountAvailable: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['created', 'captured', 'partial_captured', 'authorized', 'waiting_refund', 'partial_refunded', 'refunded', 'cancelled'],
    default: 'created',
  },
});
const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
