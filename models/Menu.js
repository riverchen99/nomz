const mongoose = require('mongoose');
// Create Schema
const MenuSchema = new mongoose.Schema({
  mealPeriod: String,
  startTime: Date,
  endTime: Date,
  menuItems: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
});
const Menu = mongoose.model('Menu', MenuSchema);
module.exports = Menu;
