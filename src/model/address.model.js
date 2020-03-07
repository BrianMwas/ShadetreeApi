const mongoose= reuqire('mongoose');
const Schema = mongoose.Schema;

const AddressSchema = new Schema({
  address: String,
  city: String,
  country: String,
  zipCode: String,
  user: {
    type: Schema.Types.ObjectId
  },
  orders: [{
    type: Schema.Types.ObjectId,
    ref: 'Order'
  }]
});


module.exports = mongoose.model('Address', AddressSchema);
