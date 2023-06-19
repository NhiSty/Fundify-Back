/**
 * @file User model for MongoDB database.
 * @module models/User
 */

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

/**
 * User model.
 * @typedef {Object} UserSchema
 * @property {string} email - User email. Required. Must be unique.
 * @property {string} password - User password. Required.
 */
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  society: { type: String, required: true },
  kbis: { type: String, required: true },
  curenncy: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);

/**
 * Exports the User model.
 * @type {object}
 */
module.exports = mongoose.model('User', userSchema);
