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

exports.processPayment = async (req, res) => {
  const formData = req.body;
  console.log('Données de paiement:', formData);
  // Demande de vérification de la transaction au PSP
  await fetch('http://psp:1338/api/psp/transactions/verifications', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: formData.transactionId,
      amount: formData.amount,
      currency: formData.currency,
      userId: formData.userId,
      merchantId: formData.merchantId,
    }),
  });
  res.send('Paiement effectué avec succès !');
};
