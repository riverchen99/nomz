const mongoose = require('mongoose');
// Create Schema
const ReviewSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true },
  comments: String,
});
const Review = mongoose.model('Review', ReviewSchema);
module.exports = Review;
