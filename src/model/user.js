const mongoose = require('mongoose');
const passwordHelper = require('../../helpers/password');
const Schema = mongoose.Schema;
const _ = require('lodash');
const opts = { timestamps: true, toJSON: { virtuals: true }, toObject : { virtuals : true }};

const UserSchema = new Schema({
    // Authentication using google this will require an id.
    googleId: String,
    facebookId: String,
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        //Avoids a full collection scan by storing a hashmap that maps to the user's email
        index: true
    },
    username: {
        type: String,
        lowercase: true,
        unique: true,
        trim: true,
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false,
        select: false
    },
    roles: {
        type: [
            {
                type: String,
                enum: ['user','agent', 'owner', 'admin']
            }
        ],
        default: ['user']
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    passwordSalt : {
        type: String,
        required: true,
        select: false
    },
    thumbnail: {
        type: String
    },
    isActivated: {
      type: Boolean,
      default : false
    },
    isAdmin: {
        type: Boolean,
        required: true,
        // default: function () {
        //     if(this.roles == ['agent'] || this.roles == ['user'] || this.roles == ['owner']) {
        //         return false
        //     } else {
        //         return true
        //     }
        // }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
}, opts);


UserSchema.index({
    firstName: 'text',
    secondName: 'text'
})


UserSchema.virtual('profile', {
    ref: 'Profile',
    localField: '_id',
    foreignField: 'userEntryId'
});

UserSchema.virtual('sent-messages', {
    ref: 'Message',
    localField: '_id',
    foreignField: 'from'
});

UserSchema.virtual('received-messages', {
    ref: 'Message',
    localField: '_id',
    foreignField: 'to'
});

UserSchema.virtual('addresses', {
  ref: 'Address',
  localField: '_id',
  foreignField: 'user'
})

UserSchema.virtual('orders', {
    ref: "Order",
    localField: "_id",
    foreignField: "user"
})

UserSchema.virtual('company', {
    ref: 'Company',
    localField: '_id',
    foreignField: 'userIdEntry'
});

UserSchema.virtual('unit', {
    ref: 'Unit',
    localField: '_id',
    foreignField: 'userIdEntry'
});


UserSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'userEntryId',
    localField: '_id'
})

UserSchema.virtual('rating').get(function () {

    if(this.roles === ['agent']) {
        var reviews = this.reviews;
        // console.log("reviews", reviews);
        let totalRating = reviews.map(r => r.rating).reduce(function(x, y) {
            return x + y;
        }, 0);
        return totalRating / reviews.length;
    } else {
        return 0;
    }
})


var User = module.exports = mongoose.model('User', UserSchema, 'User');

/**
 * Find a user by it's email and checks the password againts the stored hash
 * @param {String} email
 * @param {String} password
 * @param {Function} callback
 */

module.exports.authenticateUser = function(email, password, callback) {
    User.findOne({email: email})
    .select('+password +passwordSalt')
    .exec(function(error, user) {
        if(error) return callback(error, null);
        if(!user) return callback(error, user);

        passwordHelper.verify(password, user.password, user.passwordSalt, function(error, result) {
            if(error) return callback(error, null);
            if(result === false) return callback(error, null);

            user.password = undefined;
            user.passwordSalt = undefined;

            callback(error, user);
        });
    });
};

module.exports.registerUser = function(options, callback) {
    let data = _.clone(options);

    passwordHelper.hash(options.password, function(error, hashedPassword, salt) {
        if(error) return callback(error);

        data.passwordSalt = salt;
        data.password = hashedPassword;

        let newUser = new User(data);

        newUser.save()
        .then(result => {
            result.password = undefined;
            result.passwordSalt = undefined;

            callback(null, result);
        })
        .catch(error => {
            callback(error, null);
        });
    })
}


/**
 * Create an instance method to change password
 *
 */
 module.exports.changedPassword = function (id, oldPassword, newPassword, cb) {
    //Get the use from the db with password and salt.
    this.findById(id).select('+password +passwordSalt').exec(function(error, user) {
        if(error)  {
            return cb(err, null);
        }

        // No user found just return an empty user.
        if(!user) {
            return cb(error, user);
        };

        passwordHelper.verify(oldPassword, user.password, user.passwordSalt, function(error, result) {
            if(error) {
                return cb(error, null);
            }

            // If passwords don't match don't return the user.
            if(result == false) {
                let passwordNotMatch = new Error('Old password does not match.');
                passwordNotMatch.type = 'old_password_does_not_match';
                return cb(passwordNotMatch, null)
            }

            passwordHelper.hash(newPassword, function (error, hashedPassword, salt) {
               if(error)  {
                   return cb(error, null);
               }

                user.passwordSalt = salt;
                user.password = hashedPassword;

                user.save()
                .then(result => {
                    if(result) {
                        return cb(error, {
                            success: true,
                            message: "Password change successfull."
                        })
                    }
                })
                .catch(error => {
                    console.log("Error", error);
                    cb(error, null)
                });
            });
        });
    });
 };


 module.exports.forgotPassword = function(id, newPassword, cb) {
    this.findById(id)
    .select('+password +passwordSalt')
    .exec(function(error, user) {
        if(error)  {
            return cb(err, null);
        }
         // No user found just return an empty user.
        if(!user) {
            return cb(error, user);
        };

        passwordHelper.hash(newPassword, function(error, hashedPassword, salt) {
            if(error) {
                return cb(error, null)
            }


            user.password = hashedPassword;
            user.passwordSalt = salt;

            user.save()
            .then(user => {
                if(user) {
                        return cb(error, {
                            success: true,
                            message: "Password change successfull."
                        })
                    }
            })
            .catch(error => {
                console.log("Error", error);
                cb(error, null)
            })
        })
    })
 }
