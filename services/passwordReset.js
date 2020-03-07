const Token = require('../src/model/token');
const User = require('../src/model/user');
const path = require('path');
const sendMail = require('../services/email-config/email-send');
require('dotenv').config();
// Password reseting template.
let templates = path.join(__dirname, "..", "emails/reset_template");

exports.changePasswordRedirect =  (req, res, next) => {
    let email = req.body.email;
    User.findOne({ email: email})
    .then(user => {
        if(!user) {
          return  res.status(401).json({
                success: true,
                message: "Sorry we could not find anyone by this email: " + email
            });
        }

        Token.generate({
            user: user._id
        }, (error, token) => {
            if(error) {
                console.log("ERROR", error)
                return res.status(309).json({
                    success: false,
                    message : "Sorry we could not send the reset link."
                })
            }
            
            sendMail(templates, user.email, { firstName: user.username, token: token.hash })
            res.json({
                success: true,
                message: "We sent an email reset link to your email"
            });
            res.end();
        })
    })
    .catch(error => {
        console.log("Error", error)
        res.status(500).json({
            success: false,
            message: "Sorry something happenend..we will be restarting..."
        })
    })
}