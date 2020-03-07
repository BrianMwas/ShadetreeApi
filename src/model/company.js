const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var util = require('../../helpers/util');
const opts = { toJSON: { virtuals: true }}
var mongooseIntlPhoneNumber = require('mongoose-intl-phone-number');


const CompanySchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    name : {
        type: String,
        require: true,
        unique: true
    },
    description: {
        type: String,
        minlength: [5, "Your company description is too small"],
        maxlength: [50, "You have reached maximum length"]
    },
    website: String,
    email: String,
    phoneNumber: String,
    fullyCompleted: {
        type: Boolean,
        default: false
    },
    slug: {
        type: String,
        unique: [true, "Choose another name please"]
    },
    isDeleted : {
      type: Boolean,
      default: false
    },
    agents: [
        {
        type: Schema.Types.ObjectId,
        ref: 'User'
        }
    ]
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        ...opts,
        timestamps: true
    });

 CompanySchema.pre('save', function (next) {
     this.slug = util.createSlug(this.name);
     // console.log(this.name)
     next();
 });

CompanySchema.virtual('profile', {
    ref: 'CompanyProfile',
    localField: '_id',
    foreignField: 'companyIdEntry'
});


CompanySchema.plugin(mongooseIntlPhoneNumber, {
    hook: 'validate',
    phoneNumberField: 'phoneNumber',
    nationalFormatField: 'nationalFormat',
    internationalFormatField: 'internationalFormat',
    countryCodeField: 'countryCode'
});

module.exports = mongoose.model('Company', CompanySchema);
