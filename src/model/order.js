const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ORDER_STATUS = {
  PROCESSED: [0, 'PROCESSED'],
  DELIVERED: [1, 'DELIVERED'],
  SHIPPED: [2, 'SHIPPED']
}


const OrderSchema = Schema({
  trackingNumber : {
    type: String
  },
  orderStatus: {
    type: Number,
    default: ORDER_STATUS.PROCESSED[0]
  },
  orderItems: [{
    type: Schema.Types.ObjectId,
    ref: 'OrderItem'
  }],
  user: {
    // TODO
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  address: {
    type: Schema.Types.ObjectId,
    ref: 'Address'
  }
}, {timestamps: true});

OrderSchema,virtual('total').get(function() {
  let total = 0;
  for (let i = 0; i < this.orderItems.length; i++) {
    total += this.orderItems[i].price;
  }
  return total;
})

OrderSchema.methods.getorderStatusString = function () {
  return ORDER_STATUS[Object.keys(ORDER_STATUS)[this.orderStatus]][1]
};

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;

module.exports = {
  Order, ORDER_STATUS
}
