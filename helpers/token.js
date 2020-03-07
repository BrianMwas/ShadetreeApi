const LEN = 16;

const crypto = require('crypto');


module.exports.generateHash = generateToken


/**
 * Generates a random token using Node's crypto RNG
 *
 * @param {Number} randomBytes - random bytes to generate
 * @param {Function} callback
 */
function generateToken(randomBytes, cb) {
    if (typeof randomBytes === 'function') {
        cb = randomBytes;
        randomBytes = LEN;
    } 

    // we will return the token in 'hex'
    randomBytes = randomBytes / 2;

    crypto.randomBytes(randomBytes, (err, buf) => {
        if(err) {
            return cb(err);
        }

        var token = buf.toString('hex');

        cb(null, token);
    })
}