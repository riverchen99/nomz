const mongoose = require('mongoose');
// Create Schema

/**
 * @class User
 * @property {string} name - The name of the user.
 * @property {object[]} preferences -
 * User's dietary preferences (optional parameters for recommendation generation).
 * @property {object[]} restrictions -
 * User's restrictions restrictions (mandatory parameters for recommendation generation).
 */
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  preferences: Array,
  restrictions: Array,
  // _id: {type : String, required: true},
});
const User = mongoose.model('User', UserSchema);
module.exports = User;
