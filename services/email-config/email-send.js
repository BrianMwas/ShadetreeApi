const mailer = require('email-templates');
const config = require('../../config/mailer.config');
const path = require('path');

const email = new mailer({
    from: process.env.mailerEmail,
    juice: true,
    message: {
        from: 'shadetreetoday@gmail.com',
        list : {
            unsubscribe : "ShadeTree.com/unsubscribe"
        }
    },
    send: true,
    juiceResources: {
        preserveImportant: true,
        webResources: {
            // This is the realtive directory to your css image assets.
            // and its default path is /'build'
            // 
            // e.g If you have the following in your head
            // `<link rel="Stylesheet" href="style.css" data-inline="data-inline">`
            // Then this assumes that its in the `build/style.css`
            relativeTo: path.resolve(__dirname, '..', 'build')
        }
    },
    transport: {
        // secure: true,
        jsonTransport: true,
        host: 'smtp.gmail.com',
        port: 8500,
        auth: config.auth
    }
});

module.exports = function(template, userEmail, locals) {
    email.send({
        template: template,
        message: userEmail,
        locals: locals
    }).then(result => {
        console.log("Result from email send service", result)
    })
    .catch(error => {
        console.log("Error from email service" ,error)
    })
}