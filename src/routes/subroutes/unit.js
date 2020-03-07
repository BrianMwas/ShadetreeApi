module.exports = function(app) {
  const unitController = require("../../controller/unit");
  const userController = require("../../controller/user");
  const estateController = require("../../controller/estate");
  const companyController = require('../../controller/company');
  const locationController = require("../../controller/location");
  const auth = require("../../../middleware/authentication");
  const authorization = require("../../../middleware/authorization");
  const reviewController = require('../../controller/reviews');
  const multer = require('../../../config/imagesConfig/multer').multerUploads;
  const response = require("../../../helpers/response");
  const VERSION = "/api/v1/";

    app.route(`${VERSION}units`)
      .get(unitController.getUnits, response.toJSON('unitsData'))

    app.route(`${VERSION}units/by-category`)
    .get(unitController.getUnitsByCategory, response.toJSON("units"))

    app.route(`${VERSION}company/:companySlug/new-unit`)
      .post(companyController.getCompanyBySlug, unitController.addUnit, response.toJSON('newUnit'))

    app.route(`${VERSION}units/search/filter`)
      .get(unitController.getUnitByQuery, response.toJSON('units'))

    app.route(`${VERSION}units/search`)
      .get(unitController.getUnitsBySearch, response.toJSON('searchResults'))


    app.route(`${VERSION}units-search`)
    .get(unitController.getUnitsByCategory, response.toJSON("units"))


    app.route(`${VERSION}units/:unitId`)
      .get(unitController.getUnitById, response.toJSON('unit'))
      .patch(unitController.getUnitById, unitController.updateUnit, response.toJSON('unit'))

    app.route(`${VERSION}units/delete/:unitId`)
      .patch(auth.ensured, authorization.authorizationOnlyToOwners, unitController.getUnitById, unitController.deleteUnit)

    app.route(`${VERSION}company/:companySlug/units/:unitId/images`)
      .post(auth.ensured, companyController.getCompanyBySlug, authorization.authorizeOnlyToCompanyMembers, unitController.getUnitById, multer.array('image', 12), unitController.addUnitImages, response.toJSON('unitImages'))

    app.route(`${VERSION}units/:unitId/reviews`)
      .post(auth.ensured, authorization.authorizationOnlyToCustomers, unitController.getUnitById, unitController.addUnitReview, response.toJSON('unitReview'))

    app.route(`${VERSION}reviews/:unitId`)
      .get(reviewController.getUnitReviews, response.toJSON('unit'))

    app.route(`${VERSION}auth/users/:userId/units/location`)
      .get(auth.ensured, userController.getUserById, locationController.getUserLocation, unitController.getAllUnitLocations, response.toJSON('unitLocations'))
}
