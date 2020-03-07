'use strict';

const mongoose = require('mongoose');
const config = require('../index');

require('dotenv').config();

module.exports.init = initMongoose;

function  initMongoose (app) {

     mongoose.connect(config.mongodb.uri, {
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
    }).catch((e) => {
        console.log("URI", config.mongodb.uri)
        console.log(e)
    })

    // mongoose.set('useCreateIndex', true);
    // mongoose.set('useFindAndModify', false);
    // If the Node process ends, cleanup existing connections
    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
    process.on('SIGHUP', cleanup);


    process.on('unhandledRejection', error => {
        console.log("Unhandled rejection", error.message)
    })

    if (app) {
        app.set('mongoose', mongoose);
    }

    if(process.env.NODE_ENV === "production") {
        mongoose.set('autoIndex', false);
    }
    return mongoose;
};

function cleanup() {
    mongoose.connection.close(() => {
        console.log('Closing DB connections and stopping the app. Bye bye.');
        process.exit(0);
    });
}