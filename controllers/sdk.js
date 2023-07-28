const db = require('../db/index');

exports.sendForm = async (req, res) => {
  try {
    const transactionId = req.params.id;
    const transaction = await db.Transaction.findByPk(transactionId);
    if (!transaction) {
      return res.status(404).send('Transaction non trouvée');
    }

    return res.render('paymentForm', {
      amount: transaction.amount,
      userId: transaction.userId,
      merchantId: transaction.merchantId,
      currency: transaction.currency,
      transactionId: transaction.id,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send('Une erreur est survenue lors de la récupération des données de transaction');
  }
};
