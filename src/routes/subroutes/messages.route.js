module.exports = function(app) {
	const VERSION = "/api/v1";
	const messageController = require('../../controller/message.controller');
    const auth = require('../../../middleware/authentication');
    const response = require('../../../helpers/response');


    app.route(`${VERSION}user/messages/send`)
    .post(auth.ensured, messageController.sendMessage)

    app.route(`${VERSION}user/messages/fromMe`)
    .get(auth.ensured, messageController.getMessagesToMe, response.toJSON('messagesToMe'))
    
    app.route(`${VERSION}user/messages/toMe`)
    .get(auth.ensured, messageController.getMessagesFromMe, response.toJSON('messagesFromMe'))


    app.route(`${VERSION}user/message/delete`)
    .get(auth.ensured, messageController.deleteMessages)
}