// user.js - Définition du modèle utilisateur
const mongoose = require('mongoose');

const merchantSchema = new mongoose.Schema({
  merchantId: {
    type: String,
    required: true,
    unique: true,
  },
  companyName: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  approved: {
    type: Boolean,
    required: true,
    default: false,
  },
  autoCapture: {
    type: Boolean,
    required: true,
    default: true,
  },
  // Autres champs de l'utilisateur que vous souhaitez enregistrer
}, {
  timestamps: true,
});

const Merchant = mongoose.model('Merchant', merchantSchema);

module.exports = Merchant;
