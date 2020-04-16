const ENV = process.env.NODE_ENV || 'development';
const express = require('express');
const app = express();
const DEFAULT_PORT =  7000;
const DEFAULT_HOSTNAME = '127.0.0.1';
require('dotenv').config();


var server;

const http = require('http');
const log = require('./libs/winston');
const config = require('./config');
app.set('config', config);
app.set('root', __dirname);
app.set('env', ENV);

const mongo = require('./config/mongoose/mongoose');
const passprt =require('./config/passport/passport');
const expr = require('./config/express/express');
const route = require('./config/routes/routes');
const cors = require('cors');

// initialize
mongo.init(app);
passprt.init(app);
expr.init(app);
app.use(cors());
route.init(app);


if (!module.parent) {
  server = http.createServer(app);
  server.listen(
    config.port || DEFAULT_PORT,
    config.hostname || DEFAULT_HOSTNAME,
    () => {
      console.log(`${config.app.name} is running`);
      console.log(`  listening on port: ${config.port}`);
      console.info(`  listening on host: ${config.hostname}`)
      console.log(`  Environment: ${ENV.toLowerCase()}`);
    }
  );
}
app.listen(config.port || DEFAULT_PORT, () => {
  log.info('Express server started at port: ' + config.port || DEFAULT_PORT);
})

module.exports.app = app;
