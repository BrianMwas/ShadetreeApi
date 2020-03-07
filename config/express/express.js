
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const mongoStore = require('connect-mongo')(session);
const config = require('../index');
const winston = require('../../libs/winston');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const express = require('express');
const path = require('path');
const helmet = require('helmet')
const compression = require('compression');
const  { cloudinaryConfig } = require('../imagesConfig/cloudinaryConfig');

module.exports.init = initExpress;
function initExpress(app) {
    const sessionOpts = {
        secret: config.session.secret,
        key: 'skey.sid',
        resave: config.session.resave,
        saveUninitialized: config.session.saveUninitialized,
        name: "sessionId",
        cookie: {
            maxAge: 3600000,
            secure: false
        }
    };
    app.use(cookieParser());
    if (app.get('env') === 'production') {
        app.set('trust proxy', 1)
        sessionOpts.cookie.secure = true
    }

    app.use(bodyParser.urlencoded({
        extended: false
    }));
    app.use(bodyParser.json());
    app.disable('x-powered-by');
    app.use(helmet())
    app.use(express.static(path.resolve(__dirname, 'public')));
    app.use('*', cloudinaryConfig);

    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        winston.error('Internal error(%d): %s', res.statusCode, err.message);
        res.json({
            error: err.message
        });
    })

    app.get('/Error', function (req, res, next) {
        next(new Error('Random error!'));
    })

    if(config.session.type === 'mongo') {
        sessionOpts.store = new mongoStore({
            url: config.mongodb.uri
        });
    }

    app.use(morgan('combined', { stream : winston.stream }));

    app.use(session(sessionOpts));
    app.use(passport.initialize());
    app.use(passport.session());

    if(process.env.NODE_ENV == 'development') {
        app.use(compression());
    }

    app.use(function (req, res, next) {
        req.resources = req.resources || {};
        res.locals.app = config.app;
        next();
    });
}
