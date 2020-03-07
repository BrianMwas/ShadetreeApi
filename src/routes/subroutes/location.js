module.exports = function(app) {
  const locationController = require('../../controller/location');
  const userController = require("../../controller/user");
  const estateController = require('../../controller/estate');
  const unitController = require('../../controller/unit');
  const auth = require('../../../middleware/authentication');
  const authorization = require("../../../middleware/authorization");
  const response = require("../../../helpers/response");
  const VERSION = "/api/v1/";

  app.route(VERSION + "auth/user/location")
    .get(auth.ensured, authorization.authorizeOnlySelf, locationController.getUserLocation, response.toJSON('userLocation'))

  app.route(VERSION + "auth/estate/:estateId/location")
    .get(auth.ensured, estateController.getEstateById, locationController.getEstateLocation, response.toJSON('estateLocation'))
    .post(auth.ensured, authorization.authorizationOnlyToOwners, estateController.getEstateById, locationController.addEstateLocation)


    app.route(VERSION + "auth/estate/:estateSlug/location")
      .get(auth.ensured, estateController.getEstateBySlug, locationController.getEstateLocation, response.toJSON('estateLocation'))
      .post(auth.ensured, authorization.authorizationOnlyToOwners, estateController.getEstateById, locationController.addEstateLocation)


    app.route(VERSION + "auth/estate/:unitId/location")
      .get(auth.ensured, unitController.getUnitById, locationController.getUnitLocation, response.toJSON('unitLocation'))
      .post(auth.ensured, authorization.authorizationOnlyToOwners, unitController.getUnitById, locationController.addUnitLocation, response.toJSON('unitLocation'))

}
