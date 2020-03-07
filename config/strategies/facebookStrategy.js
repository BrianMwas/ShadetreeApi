const passport = require('passport');
const FacebookStrategy = require('passport-facebook');
const User = require('../../src/model/user');
require('dotenv').config();

passport.use(
    new FacebookStrategy({
        clientID : process.env.FacebookClientId,
        clientSecret: process.env.FacebookClientSecret,
        callbackURL : "http://localhost:8500/auth/facebook/redirect",
        enableProof: true
    }, (accessToken, refreshToken, profile, done) => {
        User
            .findOne({ facebookId: profile.id })
            .then(user => {
                if (!user) {
                    let newUser = new User({
                        // TODO
                        facebookId: profile.id,
                        email: profile.email,
                        thumbnail: profile._json.image.url,
                        username: profile.username
                    })

                    newUser.save()
                        .then(authUser => {
                            // TODO
                        })
                        .catch(error => {
                            //  TODO
                        })
                } else {

                }
            })
            .catch(error => {
                done(error, null)
            })


    })
)