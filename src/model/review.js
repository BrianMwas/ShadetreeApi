const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({

    unitEntryId : {
        type: Schema.Types.ObjectId,
        ref: 'Unit'
    },
    userEntryId : {
        type: Schema.Types.ObjectId,
        ref: 'User',
        alias: 'user',
        unique: true
    },
    rating : {
        type: Number,
        min: [0, "Minimum is 0"],
        max: [10, "Maximum is 10"],
        required: false
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: [
            {
                type: String,
                enum: ['global', 'particular']
            }
        ],
        default: ['particular']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
});




module.exports = mongoose.model('Review', ReviewSchema);
