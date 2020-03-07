const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const CommentSchema = new Schema({
  content: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: false
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product'
  }
}, { timestamps: true})
