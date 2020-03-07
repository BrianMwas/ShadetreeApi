module.exports.ensured = ensureAuthenticated;

function ensureAuthenticated(req, res, next) {
    if (!req.session.passport) {
        res.format({
        json: function () {
            res.status(401).json({
                message: 'You have not logged in yet'
            });
        }
        }); 
    } else {
       return next()
    }
   
}