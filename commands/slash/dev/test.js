const config = require('../../../config.json');

exports.data = {
	name: 'test',
	description: 'Test Slash Command',
	default_permission: false,
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
	client.api.interactions(interaction.id, interaction.token)
		.callback
		.post({ data: { type: 5 } });

	new Discord.WebhookClient(client.user.id, interaction.token).editMessage('@original', 'It Works.');
};

exports.config = {
	type: 'guild',
	command: 'test',
};
