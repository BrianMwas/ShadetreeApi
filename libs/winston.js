const winston = require('winston');
const winstonConfig = require('../config/winstonConfig').winstonOptions;

// function  getLogger(module) {
//     // let path = module.filename.split('/').slice(-2).join('/'); //using filename in log statements.
    
//     return new winston.createLogger({
//          levels : winston.config.syslog.levels,
//          transports: [
//              new winston.transports.Console({ level: 'error', colorize: true }),
//              new winston.transports.File({
//                  filename: 'combined.log',
//                  level: 'info'
//              })
//          ]
//      })
// }

// module.exports = getLogger;

const logger = winston.createLogger({
    transports : [
        new winston.transports.Console(winstonConfig.console),
        new winston.transports.File(winstonConfig.file)
    ],
    exitOnError: false // do not exit on handled Exceptions
});

logger.stream = {
    write: function(message, encoding) {
        logger.info(message);
    }
};



module.exports = logger;