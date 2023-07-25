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
  operations: [
    {
      operationId: {
        type: Number,
        required: true,
      },
      type: {
        type: String,
        enum: ['captured', 'refunded'],
        default: 'captured',
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
        enum: ['created', 'captured', 'waiting_refunded', 'partial_refunded', 'refunded', 'cancelled'],
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
  currency: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['created', 'captured', 'waiting_refunded', 'partial_refunded', 'refunded', 'cancelled'],
    default: 'created',
  },
});
const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
