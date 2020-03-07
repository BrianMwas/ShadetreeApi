const path = require('path');
const file = path.join(__dirname, "..", "logs");

let options = {
    file :{
        level: 'info',
        filename: `${file}/app.log`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880, //5mb
        maxFiles: 5,
        colorize: false
    },
    console: {
        level: 'debug',
        handleExceptions: true,
        json: true,
        colorize: true
    }
};


exports.winstonOptions = options;