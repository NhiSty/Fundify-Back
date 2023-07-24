exports.verifications = async (req, res) => {
  const { id, amount, currency } = req.body;
  res.status(200).json();

  // Simule un délai d'attente de 5 secondes
  // eslint-disable-next-line no-use-before-define
  await pspSimulation(
    `http://node:1337/api/transaction/${id}/confirm`,
    5000,
    {
      id,
      amount,
      currency,
    },
  );
};

// Fonction pour simuler le délai d'attente avec une promesse
function pspSimulation(url, ms, body) {
  // eslint-disable-next-line no-promise-executor-return
  return new Promise((resolve) => {
    setTimeout(async () => {
      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      resolve();
    }, ms);
  });
}
