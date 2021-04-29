const mongoose = require('mongoose');
const { database } = require('../index.js');

// Schema
const PollSchema = new mongoose.Schema({
	discordMessageId: { type: String, required: true },
	users: { type: Array, required: true },
});

module.exports = database.model('Poll', PollSchema, 'polls');
