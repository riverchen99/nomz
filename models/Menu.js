const mongoose = require('mongoose');
// Create Schema
const MenuSchema = new mongoose.Schema({
  mealPeriod: String,
  startTime: Date,
  endTime: Date,
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
  menuItems: { type: [mongoose.Schema.Types.String], ref: 'MenuItem' }
});
const Menu = mongoose.model('Menu', MenuSchema);
module.exports = Menu;
