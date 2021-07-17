const mongoose = require('mongoose');
const { database } = require('../index');

// Schema
const PollSchema = new mongoose.Schema({
	_id: { type: String, required: true },
	messageId: { type: String, required: true },
	channelId: { type: String, required: true },
	guildId: { type: String, required: true },
	pollType: { type: String, required: true },
	pollStyle: { type: Number, required: true },
	optionVotes: { type: Array, required: true },
	pendingVoters: { type: Array, required: true },
	submittedVoters: { type: Array, required: true },
});

module.exports = database.model('Poll', PollSchema, 'polls');
