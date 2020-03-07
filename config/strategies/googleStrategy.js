const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2');
require('dotenv').config();
const User = require('../../src/model/user');


module.exports.init = googleAuth 



function googleAuth() { passport.use(
    new GoogleStrategy({
    //Options and verification.
        callbackURL : 'auth/google/redirect',
        clientID: process.env.GoogleClientID,
        clientSecret: process.env.GoogleClientSECRET
    }, (accessToken, refreshToken, profile, done) => {
        // TODO: passport callback function.
        console.log("Passport callback fired google.")

        User.findOne({ googleId: profile.id })
            .then(user => {
                if (!user) {
                    // The user is not registered under the google platform
                    let newUser = new User({
                        googleId: profile.id,
                        
                    });

                    newUser.save()
                        .then(user => {
                           return done(null, user);
                        })
                        .catch(error => {
                          return  done(error, null)
                        })
                } else {
                    done();
                }
            })
            .catch(error => {
                console.log("Error", error)
            })

        }
    ))
    }