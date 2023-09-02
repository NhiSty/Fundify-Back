require('dotenv').config();

exports.verifications = async (req, res) => {
  const {
    amount, currency, transactionId, operationId,
  } = req.body;

  res.sendStatus(200);

  // Simule un délai d'attente de 30 secondes
  setTimeout(() => {
    // eslint-disable-next-line no-use-before-define
    sendDoneNotification({
      amount,
      currency,
      transactionId,
      operationId,
    });
  }, 30000);
};

function sendDoneNotification(body) {
  const url = process.env.URL_NOTIF_PSP;

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
        console.log(`Notification de paiement envoyée à votre API pour la transaction ${body.transactionId}. Opération ${body.operationId}.`);
      } else {
        throw new Error('Erreur lors de l\'envoi de la notification de paiement à votre API.');
      }
    })
    .catch((error) => {
      console.error(error.message);
    });
}
