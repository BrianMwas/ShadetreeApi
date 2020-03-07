const User = require('../model/User');
const Message = require('../model/message');
const ObjectId = require('mongoose').Schema.Types.ObjectId



exports.sendMessage = function (req, res, next) {
	let {to, from} = req.query;
	if(!to && !from) {
		return res.status(402).json({
			message: "Please enter a valid sender and receiver"
		})
	}

	let message = req.body.message;
	let newMessage = new Message({
		to: to,
		from: from,
		message: message
	});

	newMessage.save()
	.then(message => {
		if(!message) {
			return res.json({
				message: "Sorry but the message was not sent Please try again"
			})
		}

		res.status(201).json({
			message: "Message Sent"
		})
	})
	.catch(error => {
		res.status(500).json({
			success: false,
			message: "Sorry something happened on our end :"+error
		})
	})
}


exports.getMessagesToMe = function (req, res, next) {
	let { to, date } = req.query;
	let ByDate;

	if(date == 'latest') {
		ByDate = -1
	} else {
		ByDate = 1
	}
	Messages.find({
		to: to
	})
	.select('to deleted')
	.populate('from')
	.where('deleted', false)
	.sort({
		createdAt: ByDate
	})
	.then(messages => {
		if(messages.length <= 0) {
			return res.json({
				message: "You don't have any messages yet"
			})
		}

		req.resources.messagesToMe = messages
		next()
	})
	.catch(error => {
		res.status(500).json({
			success: false,
			message: "Sorry something happened on our end :"+error
		})
	})
}

exports.getMessagesFromMe = function (req, res, next) {
	let { from, date } = req.query;

	Messages.find({
		from: from
	}).
	select('from deleted')
	.populate('to')
	.where('deleted', false)
	.sort({
		createdAt: date
	})
	.then(messages => {
		if(messages.length <= 0) {
			return res.json({
				message: "Sorry you don't have any messages yet"
			})
		}
		req.resources.messagesFromMe = messages;
		next()
	})
	.catch(error => {
		res.status(500).json({
			success: false,
			message: "Sorry something happened on our end :"+error
		})
	})
}

exports.deleteMessages = function(req, res, next) {

	Messages.findOne({ message : req.query.message })
	.select('deleted')
	.where('deleted', false)
	.then(message => {
		if(!message) {
			return res.json({
				message: "We could not deleted"
			})
		}

		message.deleted = true;

		message.save()
		.then(message => {
			res.json({
				success: false,
				message: "Message deleted"
			})
		})
		.catch(error => {
			res.status(500).json({
				success: false,
				message: "Sorry we could not process :"+error
			})
		})
		
	}).catch(error => {
		res.status(500).json({
			success: false,
			message: "Sorry we could not process :"+error
		})
	})

}