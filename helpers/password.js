// constants.

const LEN = 256;
const SALT_LEN = 64;
const ITERATIONS = 10000;
const DIGEST = 'sha256';

const crypto = require('crypto');

// module exports.
module.exports.hash = hashPassword;
module.exports.verify = verify;

/**
 *  Creates a hash based on a salt from a given password
 *  if there is no salt a new salt will be generated
 *
 * @param {String} password
 * @param {String} salt - optional
 * @param {Function} callback
 */
function hashPassword(password, salt, cb) {
    let len = LEN / 2;

    if (3 === arguments.length) {
        generateDerivedKey(password, salt, ITERATIONS, len, DIGEST, cb);
    } else {
        cb = salt;
        crypto.randomBytes(SALT_LEN / 2, (err, salt) => {
            if(err) {
                return cb(err);
            }

            salt = salt.toString('hex');
            generateDerivedKey(password, salt, ITERATIONS, len, DIGEST, cb);
        });
    }
}

function generateDerivedKey(pswd, salt, iterations, len, digest, cb) {
    crypto.pbkdf2(pswd, salt, iterations, len, digest, (error, derivedKey) => {
        if (error) {
            return cb(error);
        } else {
            return cb(null, derivedKey.toString('hex'), salt);
        }
    });
}


/**
 *  Verifies if a password matches a hash by hashing the password
 *  with a given salt
 *
 * @param {String} password
 * @param {String} hash
 * @param {String} salt
 * @param {Function} callback
 */
function verify(password, hash, salt, cb) {
    hashPassword(password, salt, (err, hashPassword) => {
        if(err) {
            return cb(err);
        }
        if(hashPassword === hash) {
            cb(null, true);
        } else {
            cb(null, false);
        }
    })
}