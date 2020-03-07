const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    unitEntryId: {
        type: Schema.Types.ObjectId,
        ref: 'Unit'
    },
    tag: {
        type: String,
    },
    url: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Image', ImageSchema);