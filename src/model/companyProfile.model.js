const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseIntlPhoneNumber = require('mongoose-intl-phone-number')

// Should implement better profile for company

const CompanyProfileSchema = new Schema({
	companyEntryId :{
		type: Schema.Types.ObjectId,
		required: true,
		select: false
	},
	fullName: {
		type: String,
		required: true
	},
	companyWebsiteURL : {
		type: String
	},
	telephoneNumber: {
		type: String,
		required: true
	},
	description: String
}, {
	timestamp: true,
	versionKey: false
});


CompanyProfileSchema.plugin(mongooseIntlPhoneNumber, {
    hook: 'validate',
    phoneNumberField: 'telephoneNumber',
    nationalFormatField: 'nationalFormat',
    internationalFormatField: 'internationalFormat',
    countryCodeField: 'countryCode'
});

module.exports = mongoose.model('CompanyProfile', CompanyProfileSchema);