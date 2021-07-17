/* eslint-disable consistent-return */
/* eslint-disable max-len */
/* eslint-disable no-console */
// Imports
const fs = require('fs');
const Discord = require('discord.js');
const mongoose = require('mongoose');
const initslashcommands = require('./util/InitSlashCommands');

// Config
const config = require('./config.json');

// Pre-Init
const database = mongoose.createConnection(`mongodb+srv://${config.mongoDb.username}:${config.mongoDb.password}@${config.mongoDb.host}/${config.mongoDb.database}`, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
});
exports.database = database;

const client = new Discord.Client({
	partials: ['USER', 'GUILD_MEMBER', 'MESSAGE', 'REACTION'],
	intents: ['GUILDS', 'GUILD_INTEGRATIONS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS'],
});
exports.client = client;

// Init
database.on('open', () => {
	console.log('Connected to database');
});

// Functions
// loadcmds() based off of function of the same name from GitHub/HoloRes/suisei/index.js
function loadcmds() {
	client.devPrefixCommands.forEach((cmd) => {
		client.devPrefixCommands.delete(cmd.config.command);
		delete require.cache[require.resolve(`./commands/prefix/dev/${cmd.config.command}.js`)];
	});
	fs.readdir('./commands/prefix/dev', (err, files) => {
		if (err) throw (err);
		const jsfiles = files.filter((f) => f.split('.').pop() === 'js');
		if (jsfiles.length <= 0) {
			console.log('No dev commands found');
		}
		jsfiles.forEach((f) => {
			delete require.cache[require.resolve(`./commands/prefix/dev/${f}`)];
			// eslint-disable-next-line global-require,import/no-dynamic-require
			const cmd = require(`./commands/prefix/dev/${f}`);
			client.devPrefixCommands.set(cmd.config.command, cmd);
		});
	});
	fs.readdir('./commands/slash/dev', (err, files) => {
		if (err) throw (err);
		const slashFiles = files.filter((f) => f.split('.').pop() === 'js');
		if (slashFiles.length <= 0) {
			console.log('No slash commands found');
		}
		slashFiles.forEach((f) => {
			delete require.cache[require.resolve(`./commands/slash/dev/${f}`)];
			// eslint-disable-next-line global-require,import/no-dynamic-require
			const cmd = require(`./commands/slash/dev/${f}`);
			if (cmd.config.type === 'global') {
				initslashcommands.initGlobalSlashCommand(client, cmd);
				client.devGlobalSlashCommands.set(cmd.config.command, cmd);
			} else {
				delete require.cache[require.resolve(`./commands/slash/dev/${f}`)];
			}
		});
	});
}

// Discord Bot
client.on('ready', () => {
	client.user.setActivity('Various Hololive Covers', { type: 'LISTENING' });
	client.devPrefixCommands = new Discord.Collection();
	client.devGlobalSlashCommands = new Discord.Collection();
	client.devGuildSlashCommands = new Discord.Collection();
	loadcmds();
	console.log('Bot Ready');
});

// Command Handler
client.on('messageCreate', (message) => {
	if (message.author.bot) return;
	if (message.content.startsWith(config.discord.devPrefix)) {
		if (message.author.id !== config.discord.devUserId) {
			return message.reply('You do not have permission to use this command.');
		}
		const cont = message.content.slice(config.discord.devPrefix.length).split(' ');
		const args = cont.slice(1).join(' ').trim().split(' ');

		const cmd = client.devPrefixCommands.get(cont[0]);
		if (cmd) return cmd.run(client, message, args);
	}
});

// Slash Command & Button Handler
// eslint-disable-next-line consistent-return
client.ws.on('INTERACTION_CREATE', async (interaction) => {
	console.log(interaction);
	if (interaction.type === 1) {
		return client.api.interactions(interaction.id, interaction.token)
			.callback
			.post({ data: { type: 1 } });
	}
	// eslint-disable-next-line consistent-return
	if (interaction.type === 2) {
		const cont = interaction.data.name;

		const cmd = client.devGuildSlashCommands.get(cont);
		if (cmd) return cmd.response(Discord, client, interaction);
	}
	if (interaction.type === 3) {
		const cont = interaction.data.custom_id.split(':')[0];

		const cmd = client.devGuildSlashCommands.get(cont);
		if (cmd) return cmd.buttonHandler(Discord, client, interaction);
	}
});

client.login(config.discord.token);
