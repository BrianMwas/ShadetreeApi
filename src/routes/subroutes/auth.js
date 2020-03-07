
module.exports = function(app) {
    const VERSION = "/api/v1/";
    const controller = require('../../controller/auth');
    const account = require('../../controller/account');
    const auth = require('../../../middleware/authentication');
    const userController = require('../../controller/user');
    const passport = require('passport');
    const response = require('../../../helpers/response');

    app.route(`${VERSION}auth/register`)
    .post(account.register)

    app.route(`${VERSION}auth/signin`)
    .post(controller.signIn)

    app.route(`${VERSION}auth/signout`)
    .get(controller.signOut)

    app.route(`${VERSION}auth/google/redirect`)
    .get(passport.authenticate('google'), controller.googleAuth)

    app.route(`${VERSION}auth/google/profile`)
    .get(passport.authenticate('google', {
        scope : ['profile']
    }))

    app.route(`${VERSION}auth/facebook`)
    .get(passport.authenticate('facebook'))

    app.route(`${VERSION}auth/facebook/redirect`)
    .get(
        passport.authenticate('facebook', {
        failureRedirect : 'auth/signin'
            }),
        //  TODO: Enhance the route to get to the dashboard.
            userController.getAllAgents, response.toJSON('agents')
    )
}
