const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseIntlPhoneNumber = require('mongoose-intl-phone-number')


const ProfileSchema = new Schema(
    {
        userEntryId: {
            type: Schema.Types.ObjectId,
            select: false
        },
        firstName: {
            type: String,
            required: [true, "can't be blank"]
        },
        secondName: {
          type: String,
          required: [true, "can't be blank"]
        },
        profileImage: {
            type: String,
            required: true,
            trim: true
        },
        telephoneNumber: {
            type: String,
            unique: true
        },
        description: {
            type: String,
            required: true
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
);

ProfileSchema.plugin(mongooseIntlPhoneNumber, {
    hook: 'validate',
    phoneNumberField: 'telephoneNumber',
    nationalFormatField: 'nationalFormat',
    internationalFormatField: 'internationalFormat',
    countryCodeField: 'countryCode'
});

module.exports = mongoose.model('Profile', ProfileSchema);
