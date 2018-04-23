const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const reviewSchema = new Schema({
  reviewer: {type:Schema.Types.ObjectId, ref:"User"},
  reviewed: {type:Schema.Types.ObjectId, ref:"User"},
  score: Number
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
