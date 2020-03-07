
const Profile = require('../model/profile');

const passport = require('passport');

exports.signIn = function (req, res, next) {
    passport.authenticate('local', (error, user, info)=> {
        if(error) {
            console.error("Error is:", error)
            return next(error);
        }

        if(!user) {
            return res.status(400).json(info);
        }

        req.logIn(user, (error) => {
            if(error) {
                return next(error);
            }
            req.userData = user;
            req.resources.userData = user;
            res.status(200).json(user);
        });
    })(req, res, next);
};

exports.getUserProfile = (req, res, next) => {
    let user = req.params.userId;

    Profile.findOne({userEntryId: user})
    .then(profile => {
        if(!profile) {
            return res.status(203).json({
                message: "Sorry you have not set a profile"
            })
        }

        req.resources.userProfile = profile;
        next();
    })
    .catch(error => {
        res.status(405).json({
            message: "Sorry something happenend on our end"+ error
        })
    })
}

exports.signOut = function (req, res) {
    req.logout();
}


// Authentication using third parties.
exports.googleAuth = (req, res, next) => {
    
}