const { checkRole } = require('../utils/authorization');
const TransactionMDb = require('../mongoDb/models/Transaction');
const MerchantMDb = require('../mongoDb/models/Merchant');

// eslint-disable-next-line consistent-return
exports.getTransactionsStatusKPIS = async (req, res, next) => {
  try {
    checkRole(req, res, 'admin');

    const countTransactionsByStatus = await TransactionMDb.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);
    return res.status(200).json(countTransactionsByStatus);
  } catch (error) {
    next(error);
  }
};

// eslint-disable-next-line consistent-return
exports.getMerchanAcceptedAndInWaiting = async (req, res, next) => {
  try {
    checkRole(req, res, 'admin');

    const countMerchantsByStatus = await MerchantMDb.aggregate([
      {
        $group: {
          _id: '$approved',
          count: { $sum: 1 },
        },
      },
    ]);
    return res.status(200).json(countMerchantsByStatus);
  } catch (error) {
    next(error);
  }
};

// eslint-disable-next-line consistent-return
exports.getMerchantRegisteredByDate = async (req, res, next) => {
  try {
    checkRole(req, res, 'admin');

    const getFormattedDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const getDatesArray = () => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      const beforeYesterday = new Date(today);
      beforeYesterday.setDate(today.getDate() - 2);

      return [
        getFormattedDate(today),
        getFormattedDate(yesterday),
        getFormattedDate(beforeYesterday),
      ];
    };
    const datesArray = getDatesArray();

    const countMerchantsByDate = await MerchantMDb.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${datesArray[2]}T00:00:00Z`),
            $lt: new Date(`${datesArray[0]}T23:59:59Z`),
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
    ]);
    return res.status(200).json(countMerchantsByDate);
  } catch (error) {
    next(error);
  }
};
