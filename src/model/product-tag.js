const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);
let objectId = Schema.Types.ObjectId;

const TagSchema = new Schema({
  name: String,
  slug: {
    type: String,
    slug: "name",
    required: true
  },
  description: {
    type: String
  },
  products: [{
    type: objectId,
    ref: 'Product'
  }]
})

TagSchema.statics.findOneOrCreateWith = async function findOneOrCreateWith(condition, doc) {
  const one = await this.findOne(condition);
  return one || this.create(doc);
}


const Tag = mongoose.model("ProductTag", TagSchema);

module.exports = Tag;
