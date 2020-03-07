module.exports = function(app) {
    const companyController = require('../../controller/company');
    const profileController = require('../../controller/profile');
    const auth = require('../../../middleware/authentication');
    const authorization  = require('../../../middleware/authorization');
    const userController = require("../../controller/user");
    const response = require('../../../helpers/response');
    const multer = require('../../../config/imagesConfig/multer').multerUploads;
    const VERSION = "/api/v1/";

    app.route(`${VERSION}companies`)
      .get(
        companyController.getAllCompanies, 
        response.toJSON('companies')
        )

    app.route(`${VERSION}companies/searchQ`)
      .get(
        companyController.getAllCompaniesByQuery, 
        response.toJSON('companies')
        )


    app.route(`${VERSION}companies/searchAll`)
      .post(
        companyController.getBySingleSearch, 
        response.toJSON('companies')
        )

    app.route(`${VERSION}companies/create`)
      .post( 
        companyController.createCompany
        )

    app.route(`${VERSION}companies/:companySlug`)
      .get(
        companyController.getCompanyBySlug, 
        response.toJSON('company')
        )
      .put(
        auth.ensured, 
        companyController.getCompanyBySlug, 
        authorization.authorizeOnlyToCompanyOwner, 
        companyController.updateCompany, 
        response.toJSON('company')
        )
      .patch(
        auth.ensured, 
        companyController.getCompanyBySlug, 
        authorization.authorizeOnlyToCompanyOwner, 
        companyController.updateByPatch, 
        response.toJSON('company')
        )

    app.route(`${VERSION}company/:companySlug/add-profile`)
      .post(
        auth.ensured, 
        companyController.getCompanyBySlug, 
        authorization.authorizeOnlyToCompanyOwner, 
        multer.single('image'), 
        profileController.createCompanyProfile, 
        response.toJSON('companyProfile')
        )


    app.route(`${VERSION}companies/:companySlug/addAgents`)
      .post(
        
        companyController.getCompanyBySlug, 
        companyController.addAgents, 
        response.toJSON('company'))

    app.route(`${VERSION}companies/:companySlug/removeAgents`)
      .post(
        companyController.getCompanyBySlug, 
        companyController.removeCompanyAgents, 
        response.toJSON('company'))

    app.route(`${VERSION}company/:companyId`)
      .get(
        companyController.getCompanyById, 
        response.toJSON('company'))
      .put(
        auth.ensured,
        companyController.getCompanyById, 
        authorization.authorizeOnlyToCompanyOwner, 
        companyController.updateCompany, 
        response.toJSON('company'))
      .patch(
        auth.ensured, 
        companyController.getCompanyById, 
        authorization.authorizeOnlyToCompanyMembers, 
        companyController.updateByPatch, 
        response.toJSON('company'))

    app.route(`${VERSION}companies/:companyId/addAgents`)
        .post(
          auth.ensured, 
          companyController.getCompanyById, 
          authorization.authorizeOnlyToCompanyOwner, 
          userController.getAllAgents, 
          companyController.addAgents, 
          response.toJSON('company'))

    app.route(`${VERSION}companies/:companyId/removeAgents`)
      .post(auth.ensured, 
        companyController.getCompanyById, 
        authorization.authorizationOnlyToSessionedOwners, 
        companyController.removeCompanyAgents, 
        response.toJSON('company'))
}
