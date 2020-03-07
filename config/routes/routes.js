
module.exports.init = initRoutes;

function initRoutes(app) {
    const mainRoute = require('../../src/routes/main');
    mainRoute(app);
}