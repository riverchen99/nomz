const mongoose = require('mongoose');
// Create Schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  preferences: Array,
  restrictions: Array,
});
const User = mongoose.model('User', UserSchema);
module.exports = User;
