require('dotenv').config();

// Middleware pour vérifier la clé d'API
// eslint-disable-next-line consistent-return
exports.verifyApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key']; // Récupérez la clé d'API depuis l'en-tête de la requête
  if (apiKey !== process.env.API_SECRET_KEY) {
    return res.status(401).json({ error: 'Clé d\'API invalide' });
  }
  next();
}
