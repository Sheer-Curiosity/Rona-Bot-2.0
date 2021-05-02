const config = require('../../../config.json');

// Models
const RolePoll = require('../../../models/RolePoll.js');
const ServerPoll = require('../../../models/ServerPoll.js');

exports.data = {
	name: 'testpoll',
	description: 'Test Poll',
	default_permission: false,
	options: [
		{
			name: 'server',
			description: 'Log a test server-wide poll to the database',
			type: 1,
		},
		{
			name: 'role',
			description: 'Log a test role poll to the database',
			type: 1,
			options: [
				{
					name: 'role',
					description: 'Role to poll',
					type: 8,
					required: true,
				},
			],
		},
	],
};

exports.permissions = {
	permissions: [
		{
			id: config.discord.devUserId,
			type: 2,
			permission: true,
		},
	],
};

exports.response = (Discord, client, interaction) => {
	if (interaction.data.options[0].name === 'server') {
		client.api.webhooks(client.user.id, interaction.token).messages('@original').get()
			.then((res) => {
				new ServerPoll({
					_id: res.id,
					pollType: 1,
					pollStyle: 1,
				}).save();
			});

		const pollEmbed = new Discord.MessageEmbed()
			.setTitle('Test Server Poll')
			.setDescription('Test Server Poll Description')
			.setFooter('Please Help Me Programming Is Pain');

		new Discord.WebhookClient(client.user.id, interaction.token).send(pollEmbed);
	}
	if (interaction.data.options[0].name === 'role') {
		client.api.webhooks(client.user.id, interaction.token).messages('@original').get()
			.then((res) => {
				const users = client.guilds.cache
					.get(interaction.guild_id).roles.cache
					.get(interaction.data.options[0].options[0].value).members
					.map((m) => m.user.id);

				new RolePoll({
					_id: res.id,
					pollType: 2,
					pollStyle: 1,
					pendingVoters: users,
					submittedVoters: [],
				}).save();

				const pollEmbed = new Discord.MessageEmbed()
					.setTitle('Test Role Poll')
					.setDescription('Test Role Poll Description')
					.setFooter('Please Help Me Programming Is Pain')
					.addFields(
						{ name: 'Ping', value: `<@${interaction.member.user.id}>` },
					);

				new Discord.WebhookClient(client.user.id, interaction.token).send('Poll For <@433816530862604291>', pollEmbed);
				new Discord.WebhookClient(client.user.id, interaction.token).send('Poll For <@433816530862604291>');
			});
	}
};

exports.config = {
	type: 'guild',
	command: 'testpoll',
};
