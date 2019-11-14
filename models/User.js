const mongoose = require('mongoose');
// Create Schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  preferences: Array,
  restrictions: Array,
  // _id: {type : String, required: true},
});
const User = mongoose.model('User', UserSchema);
module.exports = User;
