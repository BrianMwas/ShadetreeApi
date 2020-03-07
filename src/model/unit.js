const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const paginate = require('../../helpers/pagination');
// const mongoosastic = require('mongoosastic');

const UnitSchema = new Schema({
    estate: {
      type: Schema.Types.ObjectId,
      ref: 'Estate',
      alias: 'estateEntryId'
    },
    company : {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      alias: 'companyEntryId',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    unitNumber: {
      type: Number
    },
    category: {
      type: String,
      lowerCase: true
    },
    occupied: {
        type: Boolean,
        default: false,
    },
    streetname: {
      type: String,
      required: true
    },
    rooms : {
        type: Number,
        min: [1, "Minimum number of rooms is one."],
        max: [12, "Maximum number of rooms"]        // es_indexed: true
    },
    bathrooms: {
        type: Number,
        min: [1, "You must have at least one bathroom"],
        // es_indexed: true
    },
    description: {
        type: String,
        // es_indexed: true
    },
    area: {
        type: Number,
        required: true,
        min: [100, "Please enter valid area in square feet"],
        max : [1000000, "Please confirm whether you put in the correct area"]
    },
    term: {
      type: [
          {
              type: String,
              enum: ['morgage','rental', 'purchase']
          }
      ],
      default: ['rental']
    },
    securityLevel: {
      type: String,
    },
    parking: String,
    completionYear: Number,
    price: {
        type: Number,
        required: true,
        // es_indexed: true
    },
    installment : {
      type: Number
    },
    interest : {
      type: Boolean,
      default: function() {
        if(this.term == ['morgage']) {
          return true
        } else {
          return false
        }
      }
    },
    priceMonth : {
      type: Number,
    },
    isDeleted : {
      type: Boolean,
      default: false
    }
}, {
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  },
  timestamps: true
});

UnitSchema.index({'$**': 'text'});

UnitSchema.virtual('rating').get(function () {
    var reviews = this.reviews;
    if(reviews) {
      let totalRating = reviews.map(r => r.rating).reduce(function(x, y) { return x + y}, 0);
      return totalRating / reviews.length;
    } else {
      return 0
    }
})


UnitSchema.statics.paginate = paginate;


UnitSchema.virtual('location', {
    ref: 'Location',
    localField: '_id',
    foreignField: 'unit'
});

UnitSchema.virtual('images', {
    ref: 'Image',
    localField: '_id',
    foreignField: 'unitEntryId'
});

UnitSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'unitEntryId'
});


module.exports = mongoose.model('Unit', UnitSchema);
