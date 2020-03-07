const User = require('../src/model/user');

exports.sendSubscriptionals = function(req, res, next)  {
    const { rating, scheduleTime } = req.body;

    User.find({})
    .where('isDeleted', false)
    .select('-isDeleted')
    .where('roles', ['agent'])
    .where('rating', rating)
    .cursor()
    .on('data')
    .then(agents => {
        console.log("Agents", agents);
    })
    .catch(error => {
        console.log("Error", error)
        res.json({
            message: "Sorry something happenend on our side."
        })
    })
}