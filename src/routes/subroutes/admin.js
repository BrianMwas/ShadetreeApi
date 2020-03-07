module.exports  = (app) => {
    const response = require('../../../helpers/response');
	const authorization = require('../../../middleware/authorization')

    const auth = require('../../../middleware/authentication');
    const companyController = require('../../controller/company');
    const userController = require("../../controller/user");
  	const estateController = require('../../controller/estate');
  	const unitController = require("../../controller/unit");
 

    const VERSION = "/api/v1/";

    app.route(`${VERSION}allunits/total`)
    .get(unitController.getTotalUnits, response.toJSON('totalUnits'))


   app.route(`${VERSION}allcompanies/total`)
   .get(companyController.getTotalCompanies, response.toJSON('totalCompanies'))


   app.route(`${VERSION}allusers/total`)
   .get(userController.getAllUsers, response.toJSON('allUsers'))

   app.route(`${VERSION}agents/total`)
   .get(userController.getTotalAgents, response.toJSON('totalAgents'))

   app.route(`${VERSION}owners/total`)
   .get(userController.getTotalOwners, response.toJSON('totalOwners'))

     app.route(`${VERSION}allestates/total`)
    .get(estateController.getEstateTotal, response.toJSON('totalEstates'))
}