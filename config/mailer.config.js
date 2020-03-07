require('dotenv').config();

module.exports = {
    auth : {
        user: process.env.mailerEmail,
        password: process.env.mailerPassword
    },
    defaultFromAddress: "First Last " + `${process.env.mailerEmail}`
}