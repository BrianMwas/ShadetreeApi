'use strict';

require('dotenv').config();

module.exports = {
    port: process.env.PORT,
    hostname: process.env.HOST_NAME,
    baseUrl: process.env.BASE_URL,
    mongodb: {
        uri: process.env.MONGO_URI
    },
    app: {
        name: process.env.AppName
    },
    serveStatic: true,
    session: {
        type: 'mongo', // store type, default `memory`
        secret: process.env.SESSION_SECRET,
        resave: false, // save automatically to session store
        saveUninitialized: true // saved new sessions
    }
};