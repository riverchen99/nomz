const mongoose = require('mongoose');
// Create Schema

/**
 * @class Review
 * @property {string} menuItem - The menuItem that review is associated with.
 * @property {mongoose.Schema.Types.ObjectId} author - The user who provided the review.
 * @property {number} rating - Star rating provided to the dish.
 * @property {string} comments - Optional text comments about the dish.
 */
const ReviewSchema = new mongoose.Schema({
  menuItem: { type: String, required: true },
  author: { type: mongoose.Schema.Types.String, ref: 'User', required: true },
  rating: { type: Number, required: true },
  comments: String,
});
const Review = mongoose.model('Review', ReviewSchema);
module.exports = Review;
