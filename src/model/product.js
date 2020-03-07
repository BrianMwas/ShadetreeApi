const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);


const ProductSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  name: {
    type: String,
    required: [true, "Product name is required"],
    trim: true
  },
  slug: {
    type: String,
    lowercase: true,
    unique: true,
    slug: "name"
  },
  views: {
    type: Number,
    default: 0,
    min: 0
  },
  comments: [{
    type: Schema.Types.ObjectId,
      ref: 'Comment'
  }],
  tags: [{

    type: Schema.Types.ObjectId,
    ref: 'Tag'
  }],
  categories: [{
    types: Schema.Types.ObjectId,
    ref: 'Category'
  }],
  price: {
    type: Number,
    min: 0
  },
  discount: {
    type: Schema.Types.ObjectId,
    ref: 'Discount'
  },
  description: {
    type: String,
    required: true
  }
}, { timestamps: true })


// TODO:  Can have discount and region available for shipping.
// TODO:  Images through population and ref ObjectId
// TODO: Add more fields for the product.

module.exports = mongoose.model('Product', ProductSchema)
