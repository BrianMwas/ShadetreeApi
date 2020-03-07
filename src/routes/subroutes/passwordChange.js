module.exports = function(app) {
    const controller = require('../../controller/passwordChange');
    // const tokenController = require('../../controller/passwordChange');
    const auth = require('../../../middleware/authentication');
    const userController = require('../../controller/user');

    const emailSend = require('../../../services/passwordReset');
    const VERSION = "/api/v1/";

    app.route(`${VERSION}auth/change-password`)
        .post(emailSend.changePasswordRedirect)

    app.route(`${VERSION}auth/forgot-password/:resetToken`)
        .post(controller.forgotPassword)

    app.route(`${VERSION}auth/change-password`)
    	.post(auth.ensured, controller.changePassword)

   	app.route(`${VERSION}auth/activate-user/:userId`)
   		.get(userController.activateAccount)
}