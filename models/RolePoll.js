const mongoose = require('mongoose');
const { database } = require('../index.js');

// Schema
const RolePollSchema = new mongoose.Schema({
	_id: { type: String, required: true },
	pollType: { type: Number, required: true },
	pollStyle: { type: Number, required: true },
	pendingVoters: { type: Array, required: true },
	submittedVoters: { type: Array, required: true },
});

module.exports = database.model('RolePoll', RolePollSchema, 'polls');
