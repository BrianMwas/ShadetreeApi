const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);


const OrderItemSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  slug: {
    type: String,
    required: true,
    slug: "name"
  },
  price: {
    type: String,
    required: [true, "Price is required"]
  },
  quantity: {
    type: Number,
    required: [true, "You need atleast one item"],
    default: 0
  },
  order: {
    type: Schema.Types.ObjectId,
    ref: 'Order'
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {timestamps: true});

module.exports = mongoose.model('OrderItem', OrderItemSchema);
