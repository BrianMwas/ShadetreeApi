const mongoose= reuqire('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const CategorySchema = new Schema({
  name: String,
  slug: {
    type: String,
    unique: true,
    slug: "name",
    required: true
  },
  description: {
    type: String
  },
  products: [{
    type: Schema.Types.ObjectId,
    ref: 'Product'
  }]
}, {timestamps: true})


CategorySchema.statics.findOneOrCreateWith = async function findOneOrCreateWith(condition, doc) {
  const one = await this.findOne(condition);

  return one || this.create(doc);
}


module.exports = mongoose.model('ProductCategory', CategorySchema);
