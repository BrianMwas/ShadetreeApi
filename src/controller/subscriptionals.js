const User = require('../model/user');


exports.sendEmailsToAgents = (req, res, next) => {

    User.find()
    .where('isDeleted', false)
    .select('-isDeleted')
    .where('roles', ['agent'])
    .lean()
    .exec()
    .then()
    .catch(error => {
        console.log("Email to agents error", error)
        res.status(402).json({
            success: false,
            message: "Sorry something happenend on our end.."
        })
    })
}

exports.sendEmailToCustomers = (req, res, next) => {
    User.find()
    .where('isDeleted', false)
    .select('-isDeleted')
    .where('roles', ['user'])
    .then(result => {
        console.log('result', result)
    })
    .catch(error => {
        console.log('error', error)
    })
}