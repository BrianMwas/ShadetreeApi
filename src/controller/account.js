const User = require('../model/user');
const Profile = require('../model/profile');
const _ = require('lodash');
const greeting = require('../../services/greeting');

let profile = require('../controller/profile');


exports.register = function(req, res, next) {

    let data = _.pick(req.body, "email", "username", "password");
    let userType = req.query.userType

    if (userType == null) {
      userType = 'user';
    }

    if(userType === 'company') {
        data.roles = ['owner'];
    }
    if(userType === 'agent') {
        data.roles = ['agent'];
    }

    if(userType == undefined) {
      data.roles = ['user']
    }


    // if(userType == "$admin$2020%user=Admin")  {
    //     data.roles = ['admin']
    // }

    User.registerUser(data, (error, user) => {
        if(error && (11000 === error.code || 11001 === error.code)) {
            return res.status(400).json({
                message: 'Account already registered'
            });
        }

        if(error) {
            return next(error)
        }

        req.logIn(user, (error) => {

            if(error) {
                res.json({
                  error
                })
            }
            delete user.password;
            delete user.passwordSalt;

            console.log("User", user._id);
            let roles = user.roles[0];
            console.log(user.roles)
            if(roles === 'agent' || roles === 'owner') {
                greeting.sendAgentActivation(user.email,  { userId: user.id, firstName: user.username });
                return res.status(200).json({
                    success: true,
                    message: "Hi," + user.username + " welcome to the shack. Please activate your account using the link we sent to your email"
                });
            }

            if(roles === 'admin') {
                return res.status(200).json({
                    success: true,
                    message: "Hi," + user.username + "Welcome you have registered as an Admin"
                });
            }
            res.status(200).json({
                success  : true,
                message: "Hi," + user.username + " welcome to reelostate."
            });
        });
    });
};
