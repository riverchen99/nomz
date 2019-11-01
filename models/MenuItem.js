const mongoose = require('mongoose');
// Create Schema
const MenuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});
const MenuItem = mongoose.model('MenuItem', MenuItemSchema);
module.exports = MenuItem;
// note: mongoose automatically uses menuitems as collection name
// https://mongoosejs.com/docs/models.html
