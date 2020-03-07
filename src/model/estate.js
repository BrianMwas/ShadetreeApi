const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let util = require('../../helpers/util');

const EstateSchema = new Schema({
    userIdEntry: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        select: false
    },
    companyEstates : {
        type: Schema.Types.ObjectId,
        ref: 'Company',
        select: false
    },
    name: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        index: true
    },
    street: {
        type: String,
        required: true
    },
    built: {
        type: Date,
        required: true,
        select: false
    },
    areaSafety: {
        type: Number,
        min: [1, "Minimum safety level is one."],
        max: [5, "Maximum safety level is 5."],
        select: false
    },
    parking: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        unique: true
    },
    isDeleted : {
      type: Boolean,
      default: false
    }
}, {
    timestamps: true,
    versionKey: false,
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
});

EstateSchema.virtual('images', {
    ref: 'Image',
    foreignField: 'estateEntryId',
    localField : '_id'
});

EstateSchema.pre('save', function(next) {
  let now = new Date();
  if(!this.createdAt) {
    this.createdAt = now;
  } else {
    this.updatedAt = now;
  }
  this.slug = util.createSlug(this.name);
  next();
})

EstateSchema.virtual('profile', {
    ref: 'Profile',
    localField: '_id',
    foreignField: 'estateEntryId'
});

EstateSchema.virtual('location', {
    ref: 'Location',
    localField: '_id',
    foreignField: 'estate'
});

EstateSchema.virtual('units', {
    ref: 'Unit',
    localField: '_id',
    foreignField: 'estateEntryId'
});

module.exports = mongoose.model('Estate', EstateSchema);
