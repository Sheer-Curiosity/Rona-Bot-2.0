/* eslint-disable consistent-return */
/* eslint-disable max-len */
/* eslint-disable no-console */
// Imports
const Discord = require('discord.js');
const mongoose = require('mongoose');

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
	partials: ['GUILD_MEMBER', 'MESSAGE', 'REACTION'],
	intents: ['GUILDS', 'GUILD_INTEGRATIONS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS'],
});
exports.client = client;

// Models
const Poll = require('./models/Poll.js');

// Init
client.on('ready', () => {
	client.user.setActivity('VIVA HAPPY! - Yozora Mel cover', { type: 'LISTENING' });
	console.log('READY');
});

database.on('open', () => {
	console.log('Connected to database');
});

// Command Handler
client.on('message', (message) => {
	if (message.author.bot) return;
	if (message.content.startsWith(config.discord.devPrefix)) {
		if (message.author.id !== '433816530862604291') {
			return message.reply('You do not have permission to use this command.');
		}
		const cont = message.content.slice(config.discord.devPrefix.length).split(' ');

		if (cont[0] === 'initSlashCommands') {
			client.api.applications(client.user.id).guilds(message.guild.id).commands.post({
				data: {
					name: 'testdb',
					description: 'Test Database Connection',
				},
			});
			client.api.applications(client.user.id).guilds(message.guild.id).commands.post({
				data: {
					name: 'test',
					description: 'Test Slash Command',
				},
			});

			message.reply('Done!');
		} else if (cont[0] === 'removeSlashCommands') {
			client.api.applications(client.user.id).guilds(message.guild.id).commands.get()
				.then((res) => {
					for (let i = 0; i < res.length; i += 1) {
						console.log(`Deleting Slash Command "${res[i].name}" (ID: ${res[i].id})`);
						client.api.applications(client.user.id).guilds(message.guild.id).commands(res[i].id).delete();
					}
					message.reply('Done!');
				});
		} else if (cont[0] === 'getSlashCommands') {
			let slashCmds = '\n';
			client.api.applications(client.user.id).guilds(message.guild.id).commands.get()
				.then((res) => {
					for (let i = 0; i < res.length; i += 1) {
						slashCmds += `/${res[i].name}\n`;
					}
					message.reply(`Currently registered guild slash commands:${slashCmds}`);
				});
		}
	}
});

// Slash Command Handler
// eslint-disable-next-line consistent-return
client.ws.on('INTERACTION_CREATE', async (interaction) => {
	if (interaction.type === 1) {
		return client.api.interactions(interaction.id, interaction.token)
			.callback
			.post({ data: { type: 1 } });
	}
	// eslint-disable-next-line consistent-return
	if (interaction.type !== 2) return;

	if (interaction.data.name === 'test') {
		client.api.interactions(interaction.id, interaction.token)
			.callback
			.post({ data: { type: 5 } });

		new Discord.WebhookClient(client.user.id, interaction.token).editMessage('@original', 'It Works.');
	}
	if (interaction.data.name === 'testdb') {
		client.api.interactions(interaction.id, interaction.token)
			.callback
			.post({ data: { type: 5 } });
		client.api.webhooks(client.user.id, interaction.token).messages('@original').get()
			.then((res) => {
				new Poll({
					discordMessageId: `${res.id}`,
					users: ['391379592981774337', '433816530862604291'],
				}).save();
			});
		new Discord.WebhookClient(client.user.id, interaction.token).editMessage('@original', 'It Works.');
	}
});

client.login(config.discord.token);
