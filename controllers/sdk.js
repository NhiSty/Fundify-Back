const db = require('../db/index');
require('dotenv').config();

const extractClientSecretCookie = (cookieString) => {
  const matches = cookieString.match(/clientSecret=([^;]+)/);
  return matches ? matches[1] : null;
};

exports.sendForm = async (req, res) => {
  try {
    if (!req.headers.cookie) {
      return res.send('<h1>1 UNAUTHORIZED</h1>');
    }
    const clientSecret = extractClientSecretCookie(req.headers.cookie);

    if (!clientSecret) {
      return res.send('<h1>2 UNAUTHORIZED</h1>');
    }

    const transactionId = req.params.id;
    const transaction = await db.Transaction.findByPk(transactionId);
    if (!transaction) {
      return res.status(404).send('Transaction non trouvée');
    }

    let credentials;

    const merchant = await db.Merchant.findByPk(transaction.merchantId);
    if (merchant) {
      credentials = await db.Credential.findByPk(merchant.credentialsId);
      if (credentials) {
        if (credentials.clientSecret !== clientSecret) {
          return res.send('<h1>3 UNAUTHORIZED</h1>');
        }
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
