const path = require('path');
const templates = path.resolve(__dirname, '..', 'emails/intro_template');
const sendMail = require('../services/email-config/email-send');


exports.sendAgentActivation = function (email,  {  userId, firstName }) {
    sendMail(templates, email, { user : userId, firstName: firstName });
}