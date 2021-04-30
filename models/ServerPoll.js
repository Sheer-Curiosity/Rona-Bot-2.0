const mongoose = require('mongoose');
const { database } = require('../index.js');

// Schema
const ServerPollSchema = new mongoose.Schema({
	_id: { type: String, required: true },
	pollType: { type: Number, required: true },
});

module.exports = database.model('ServerPoll', ServerPollSchema, 'polls');
