module.exports = function(app) {
    const userController = require('../../controller/user');
    const authController = require('../../controller/auth')
    const auth = require('../../../middleware/authentication');
    const authorization = require("../../../middleware/authorization");
    const response = require('../../../helpers/response');
    const companyController = require('../../controller/company');
    const profileController = require("../../controller/profile");
    const multer = require('../../../config/imagesConfig/multer').multerUploads;
    const VERSION = "/api/v1/";

    app.route(`${VERSION}companies/:companySlug/users`)
      .get(auth.ensured, companyController.getCompanyBySlug, userController.getAllUsers, response.toJSON('users'))

    app.route(`${VERSION}companies/:companySlug/user/:userId`)
      .get(auth.ensured,companyController.getCompanyBySlug, userController.getUserById, response.toJSON('user'))

    app.route(`${VERSION}users/agents`)
      .get(userController.getAllAgents, response.toJSON('agents'))

    app.route(`${VERSION}auth/agent-activation/:userId`)
      .put(userController.activateAccount)
    
    app.route(`${VERSION}agents`)
      .get(userController.getByQuery, response.toJSON('agents'))

    app.route(`${VERSION}users/agents/:agentId`)
      .get(auth.ensured, userController.getAgentById, response.toJSON('agent'))
      .post(auth.ensured,  userController.getAgentById, userController.addAgentReview, response.toJSON('agentReview'))


    app.route(`${VERSION}user/create-profile`)
      .post(auth.ensured, authorization.authorizeOnlySelf, multer.single('image'), profileController.createUserProfile, response.toJSON('userProfile'))
    
    app.route(`${VERSION}user/:userId/profile`)
      .get(authController.getUserProfile, response.toJSON('userProfile'))


    app.route(`${VERSION}user/update`)
      .put(auth.ensured, authorization.authorizeOnlySelf,  userController.updateUser, response.toJSON('user'))
}
