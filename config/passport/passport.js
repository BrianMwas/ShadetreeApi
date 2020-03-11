const passport = require('passport');
const mongoose = require('mongoose');
const User = require('../../src/model/user');

module.exports.init = initPassport;

function initPassport() {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, done);
    });

    //load strategies
    require("../strategies/local").init();
    // require('../strategies/googleStrategy').init()
}