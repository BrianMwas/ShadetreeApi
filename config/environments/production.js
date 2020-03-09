"use strict";

require('dotenv').config();




module.exports = {
  port : process.env.PORT,
  hostname : process.env.HOST_NAME,
  baseUrl : process.env.PROD_URI,
  mongodb : {
      uri: process.env.MONGO_PROD_URI
  },
  app : {
      name: process.env.AppName
  },
  serveStatic : true,
  session : {
      type: 'mongo',
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true // saved new sessions
  }
}
