/**
 * Cette fonction permet de faire une requête vers le PSP pour vérifier la validité d'une opération sur
 * une transaction.
 *
 * @param {Object} payload
 * @param {string} payload.amount
 * @param {string} payload.currency
 * @param {string} payload.operationId
 * @param {string} payload.transactionId
 *
 * @returns {Promise}
 */
module.exports = function requestPspCheck(payload) {
  return fetch(process.env.URL_PSP_VERIFICATION, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: payload.amount,
      currency: payload.currency,
      operationId: payload.operationId,
      transactionId: payload.transactionId,
      notificationUrl: process.env.URL_NOTIF_PSP,
    }),
  });
};
