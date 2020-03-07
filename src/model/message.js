const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const MessageSchema = new Schema({
    from:  {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
        select: false
    },
    to: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
        select: false
    },
    message: {
        type: String,
        require: true,
        trim: true
    },
    deleted: {
        type: Boolean,
        default: false,
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Message', MessageSchema)