module.exports = function(app) {
  const passwordResetController = require("../../../services/passwordReset");
  const VERSION = "/api/v1/";

  app.route(`${VERSION}forgot-password`)
    .post(passwordResetController.changePasswordRedirect)
}
