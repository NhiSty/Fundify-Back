const db = require('../db/index');
require('dotenv').config();

exports.sendForm = async (req, res) => {
  try {
    const transactionId = req.params.id;
    const transaction = await db.Transaction.findByPk(transactionId);
    if (!transaction) {
      return res.status(404).send('Transaction non trouvée');
    }

    const merchant = await db.Merchant.findByPk(transaction.merchantId);
    const credentials = await db.Credential.findByPk(merchant.credentialsId);
    if (!merchant) {
      if (transaction.status === 'captured') {
        return res.send('<h1>UNAUTHORIZED</h1>');
      }
    }

    return res.render('paymentForm', {
      amount: transaction.amount,
      url: process.env.PAYMENT_URL_OPERATIONS,
      redirectUrl: merchant.confirmationRedirectUrl,
      id: merchant.id,
      clientToken: credentials.clientToken,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send('Une erreur est survenue lors de la récupération des données de transaction');
  }
};
