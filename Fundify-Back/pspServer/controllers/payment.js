require('dotenv').config();

exports.verifications = async (req, res) => {
  const {
    amount, currency, transactionId, operationId,
  } = req.body;

  console.log({
    amount, currency, transactionId, operationId,
  });

  res.sendStatus(200);

  // Simule un délai d'attente de 5 secondes
  setTimeout(() => {
    // eslint-disable-next-line no-use-before-define
    sendDoneNotification({
      amount,
      currency,
      transactionId,
      operationId,
    });
  }, 10000);
};

function sendDoneNotification(body) {
  const url = process.env.URL_NOTIFICATIONS;

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.API_SECRET_KEY,
    },
    body: JSON.stringify(body),
  })
    .then((response) => {
      if (response.status === 200) {
        console.log('Notification de paiement envoyée avec succès à votre API.');
      } else {
        throw new Error('Erreur lors de l\'envoi de la notification de paiement à votre API.');
      }
    })
    .catch((error) => {
      console.error(error.message);
    });
}
