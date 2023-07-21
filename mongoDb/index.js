const mongoose = require('mongoose');

// URL de connexion à notre base de données MongoDB
const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DB_NAME}`;

// Connexion à la base de données MongoDB
mongoose.connect('mongodb+srv://whisky:thomas78@cluster0.wdnkq.mongodb.net/fundify', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((err) => console.error('Erreur de connexion à MongoDB :', err));
