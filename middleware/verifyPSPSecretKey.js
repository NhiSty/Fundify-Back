require('dotenv').config();

// eslint-disable-next-line consistent-return
exports.verifyApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.API_SECRET_KEY) {
    return res.status(401).json({ error: 'Clé d\'API invalide' });
  }
  next();
};
