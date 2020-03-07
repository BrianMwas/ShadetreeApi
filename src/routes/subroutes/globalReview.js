module.exports = function(app) {
    const globalReviewController = require('../../controller/reviews');
    const userController = require('../../controller/user');
    const auth = require('../../../middleware/authentication');
    const authorization = require('../../../middleware/authorization')
    const reponse = require('../../../helpers/response')
    const VERSION = "/api/v1/";


    app.route(`${VERSION}users/overall-review`)
        .post(auth.ensured, authorization.authorizationOnlyToCustomers, globalReviewController.addGlobalReview, reponse.toJSON('globalReview'))

    app.route(`${VERSION}site/reviews`)
        .get(globalReviewController.getSiteReviews, reponse.toJSON('siteReviews'))
}
