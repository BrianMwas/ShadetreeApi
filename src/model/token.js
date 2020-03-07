"use strict";

const EXPIRATION = 1;
const LEN = 32;
const mongoose = require('mongoose');
const tokenHelper = require('../../helpers/token');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;


var TokenSchema = new Schema({
    user: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    hash: {
        type: String
    },
    expiresAt: {
        type: Date,
        default: function () {
            var now = new Date();
            now.setDate(now.getDate() + EXPIRATION);

            return now;
        }
    },
    createdAt : {
        type: Date,
        default: Date.now
    }
});


const Token  = module.exports = mongoose.model('Token', TokenSchema);

/**
 * Generate a random token for a user, length is defined by the LEN constant.
 * @param {Function} takes a callback.
 */

 module.exports.generate = function(options, cb) {
     tokenHelper.generateHash(options.tokenLength || LEN, function(error, tokenString) {
         if(error) {
             return cb(error);
         }

         options.hash = tokenString;
         Token.create(options, cb);
     });
 };
