module.exports = function(app) {
    const auth = require('./subroutes/auth');
    const company = require('./subroutes/company');
    const unit = require('./subroutes/unit');
    const location = require('./subroutes/location');
    const estate = require('./subroutes/estate');
    const user = require('./subroutes/users');
    const globalReview = require('./subroutes/globalReview');
    const passwordChange = require('./subroutes/passwordChange')
    const admin = require('./subroutes/admin')

    globalReview(app);
    auth(app);
    user(app);
    company(app);
    unit(app);
    estate(app);
    location(app);
    passwordChange(app);
    admin(app)
}
