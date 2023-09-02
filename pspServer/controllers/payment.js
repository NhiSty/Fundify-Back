require('dotenv').config();

exports.verifications = async (req, res) => {
  const {
    amount, currency, transactionId, operationId,
  } = req.body;

  res.sendStatus(200);

  // Simule un délai d'attente de 30 secondes
  setTimeout(async () => {
    // eslint-disable-next-line no-use-before-define
    await sendDoneNotification({
      amount,
      currency,
      transactionId,
      operationId,
    });
  }, 5000);
};

async function sendDoneNotification(body) {
  const url = process.env.URL_NOTIF_PSP;

  try {
    const request = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.API_SECRET_KEY,
      },
      body: JSON.stringify(body),
    });

    console.log(request);

    const response = await request.json();
    console.log(response);

    /*

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
     */
  } catch (e) {
    console.log(e);
  }
}
