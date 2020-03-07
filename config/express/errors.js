
module.exports.init = initErrors

function initErrors(app) {
    const morgan = require('morgan');
    const winston = require('../../libs/winston');


    app.use(morgan('combined', { stream : winston }));
    app.use((req, res, next) => {
        res.status(404);
        winston.debug('Not found URL: %s', req.url);
        res.json({
            error : 'Not found'
        });
        return;
    });

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
}