const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GeoSchema = new Schema({
    type: {
        type: String,
        enum : ['Point'],
        required: true
    },
    coordinates: {
        type: [Number],
        required: true,
        index : "2dsphere"
    },
    estate: {
        type: Schema.Types.ObjectId,
        ref: 'Estate',
        select: false
    },
    unit: {
        type: Schema.Types.ObjectId,
        ref: 'Unit',
        select: false
    },
    user: {
        type: Schema.Types.ObjectId,
        select: false,
        ref: 'User'
    }
},
{
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model('Location', GeoSchema);
