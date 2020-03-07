const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

const DiscountSchema = new Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    isPercent: {
        type: Boolean,
        required: true,
        default: false
    },
    amount :{
        type: Number,
        required: true,
        validate : {
            validator : function(v) {
                if(this.isPercent) {
                    return v < 100;
                }
            },
            message : props => `${props.value} is supposed to be below 100 percent`
        }
    },
    expiringAt: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true
    }
}, {
  timestamps: true
})


module.exports = mongoose.model("Discount", DiscountSchema);
