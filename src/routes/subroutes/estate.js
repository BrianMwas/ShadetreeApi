module.exports = function(app) {
  const estateController = require('../../controller/estate');
  const auth = require('../../../middleware/authentication');
  const authorization = require('../../../middleware/authorization');
  const response = require('../../../helpers/response');
  const locationController = require("../../controller/location");
  const userController = require('../../controller/user');
  const companyController = require('../../controller/company');
  const VERSION = "/api/v1/";

  app.route(`${VERSION}estates`)
    .get(estateController.getEstates, response.toJSON('estates'))

  app.route(`${VERSION}estates/Search`)
    .get(estateController.getEstateByQuery, response.toJSON('estates'))

  app.route(`${VERSION}geo/:userId/estates/locations`)
    .get(auth.ensured, userController.getUserById, locationController.getUserLocation, estateController.getAllEstateLocation, response.toJSON('estateLocations'))

  app.route(`${VERSION}estates/:estateId`)
    .get(estateController.getEstateById, response.toJSON('estate'))
    .put(auth.ensured, authorization.authorizationOnlyToOwners, estateController.getEstateById, estateController.updateEstate)
    .delete(auth.ensured, authorization.authorizationOnlyToOwners, estateController.getEstateById, estateController.removeEstate)

  app.route(`${VERSION}estate-by-slug/:estateSlug`)
    .get(estateController.getEstateBySlug, response.toJSON('estate'))

  app.route(`${VERSION}estate-update/:estateSlug`)
    .put(auth.ensured, authorization.authorizationOnlyToOwners, estateController.getEstateBySlug, estateController.updateEstate)

app.route(`${VERSION}estate-remove/:estateSlug`)
  .put(auth.ensured, authorization.authorizationOnlyToOwners, estateController.getEstateBySlug, estateController.removeEstate)



  app.route(`${VERSION}auth/new-estate`)
    .post(auth.ensured, authorization.authorizationOnlyToOwners, estateController.addEstate)

  app.route(`${VERSION}auth/:userId/estates/:estateSlug/new-image`)
    .post(auth.ensured, authorization.authorizationOnlyToOwners, userController.getUserById, estateController.getEstateBySlug, estateController.addEstateImage)

  app.route(`${VERSION}auth/:userId/company/:companySlug/add-estate`)
    .post(auth.ensured, authorization.authorizationOnlyToOwners, userController.getUserById, companyController.getCompanyBySlug, estateController.addCompanyEstate);
}
