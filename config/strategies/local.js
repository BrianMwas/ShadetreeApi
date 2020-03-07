const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = require('../../src/model/user');

module.exports.init = buildLocalStrategy;

function buildLocalStrategy() {
    var local = new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, (email, password, done) => {
        
        User.authenticateUser(email, password, (error, user) => {
            if(error) {
                return done(error);
            }

            if(!user){
                return done(null, false, { message: "Wrong email or password"})
            }

            return done(null, user);
        });
    });

    passport.use('local', local);
}