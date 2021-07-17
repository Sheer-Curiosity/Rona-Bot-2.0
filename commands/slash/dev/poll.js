const { customAlphabet } = require('nanoid');
const config = require('../../../config.json');

// Models
const Poll = require('../../../models/Poll');

exports.data = {
	name: 'poll',
	description: 'Runs a poll',
	default_permission: false,
	options: [
		{
			name: 'server',
			description: 'Polls all members in the server',
			type: 1,
			options: [
				{
					name: 'title',
					description: 'Title of the poll',
					type: 3,
					required: true,
				},
				{
					name: 'time',
					description: 'How long in hours the poll should be open before closing',
					type: 4,
					required: true,
				},
				{
					name: 'option-one',
					description: 'A poll option',
					type: 3,
					required: true,
				},
				{
					name: 'option-two',
					description: 'A poll option',
					type: 3,
					required: true,
				},
				{
					name: 'option-three',
					description: 'A poll option',
					type: 3,
					required: false,
				},
				{
					name: 'option-four',
					description: 'A poll option',
					type: 3,
					required: false,
				},
				{
					name: 'option-five',
					description: 'A poll option',
					type: 3,
					required: false,
				},
				{
					name: 'option-six',
					description: 'A poll option',
					type: 3,
					required: false,
				},
				{
					name: 'option-seven',
					description: 'A poll option',
					type: 3,
					required: false,
				},
				{
					name: 'option-eight',
					description: 'A poll option',
					type: 3,
					required: false,
				},
				{
					name: 'option-nine',
					description: 'A poll option',
					type: 3,
					required: false,
				},
				{
					name: 'option-ten',
					description: 'A poll option',
					type: 3,
					required: false,
				},
			],
		},
		{
			name: 'role',
			description: 'Polls a specific role',
			type: 1,
			options: [
				{
					name: 'role',
					description: 'Role to poll',
					type: 8,
					required: true,
				},
				{
					name: 'title',
					description: 'Title of the poll',
					type: 3,
					required: true,
				},
				{
					name: 'time',
					description: 'How long in hours the poll should be open before closing',
					type: 4,
					required: true,
				},
				{
					name: 'option-one',
					description: 'A poll option',
					type: 3,
					required: true,
				},
				{
					name: 'option-two',
					description: 'A poll option',
					type: 3,
					required: true,
				},
				{
					name: 'option-three',
					description: 'A poll option',
					type: 3,
					required: false,
				},
				{
					name: 'option-four',
					description: 'A poll option',
					type: 3,
					required: false,
				},
				{
					name: 'option-five',
					description: 'A poll option',
					type: 3,
					required: false,
				},
				{
					name: 'option-six',
					description: 'A poll option',
					type: 3,
					required: false,
				},
				{
					name: 'option-seven',
					description: 'A poll option',
					type: 3,
					required: false,
				},
				{
					name: 'option-eight',
					description: 'A poll option',
					type: 3,
					required: false,
				},
				{
					name: 'option-nine',
					description: 'A poll option',
					type: 3,
					required: false,
				},
				{
					name: 'option-ten',
					description: 'A poll option',
					type: 3,
					required: false,
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
		const nanoid = customAlphabet('1234567890', 18);
		const uid = nanoid();
		const buttonList = [];
		const fieldsList = [];
		const dbOptionVotes = [];
		client.api.interactions(interaction.id, interaction.token)
			.callback
			.post({ data: { type: 5 } });

		// eslint-disable-next-line no-plusplus
		for (let i = 0; i < interaction.data.options[0].options.length - 2; i++) {
			const option = interaction.data.options[0].options[i + 2].value;

			buttonList.push({
				type: 2,
				label: `Option ${i + 1}`,
				style: 2,
				custom_id: `poll:option_${i + 1}`,
			});
			fieldsList.push({
				name: `${i + 1}: ${option}`,
				value: 'Votes: 0',
			});
			dbOptionVotes.push(0);
		}

		client.api.webhooks(client.user.id, interaction.token).messages('@original').get()
			.then((res) => {
				new Poll({
					_id: uid,
					guildId: interaction.guild_id,
					channelId: interaction.channel_id,
					messageId: res.id,
					pollType: 'server',
					pollStyle: 1,
					optionVotes: dbOptionVotes,
					pendingVoters: [],
					submittedVoters: [],
				}).save();
			});

		new Discord.WebhookClient(client.user.id, interaction.token).send({
			embeds: [{
				type: 'rich',
				title: interaction.data.options[0].options[0].value,
				description: `Server-Wide Poll\n**Duration:** ${interaction.data.options[0].options[1].value} Hours\n\nOptions:`,
				color: 0x00FFFF,
				fields: fieldsList,
				footer: {
					text: 'Pain.exe',
				},
			}],
			components: [
				{
					type: 1,
					components: buttonList,
				},
			],
		});

		setTimeout(async () => {
			client.api.webhooks(client.user.id, interaction.token).messages('@original').get()
				.then(async (res) => {
					// eslint-disable-next-line max-len
					const poll = await Poll.findOne({ messageId: res.id, guildId: interaction.guild_id })
						.exec()
						.catch((err) => {
							// eslint-disable-next-line no-console
							console.log(`Error: ${err}`);
						});

					if (!poll) return;

					// eslint-disable-next-line max-len
					client.guilds.cache.get(poll.guildId).channels.cache.get(poll.channelId).messages.fetch(poll.messageId)
						.then((message) => {
							const msgEmbed = message.embeds[0];

							message.edit({
								embeds: [{
									type: 'rich',
									title: `**POLL ENDED:** ${interaction.data.options[0].options[0].value}`,
									description: 'Server-Wide Poll\n\nResults:',
									color: 0x00FFFF,
									fields: msgEmbed.fields,
									footer: {
										text: 'Pain.exe',
									},
								}],
								components: [],
							});
						});

					poll.remove();
				})
				.catch(async (err) => {
					// eslint-disable-next-line no-console
					console.log(err);
					const poll = await Poll.findOne({ _id: uid })
						.exec()
						.catch((err2) => {
							// eslint-disable-next-line no-console
							console.log(`Error: ${err2}`);
						});

					if (!poll) return;

					poll.remove();
				});
		}, interaction.data.options[0].options[1].value * 60 * 1000);
	}
	if (interaction.data.options[0].name === 'role') {
		const nanoid = customAlphabet('1234567890', 18);
		const uid = nanoid();
		const buttonList = [];
		const fieldsList = [];
		const dbOptionVotes = [];
		client.api.interactions(interaction.id, interaction.token)
			.callback
			.post({ data: { type: 5 } });

		// eslint-disable-next-line no-plusplus
		for (let i = 0; i < interaction.data.options[0].options.length - 3; i++) {
			const option = interaction.data.options[0].options[i + 3].value;

			buttonList.push({
				type: 2,
				label: `Option ${i + 1}`,
				style: 2,
				custom_id: `poll:option_${i + 1}`,
			});
			fieldsList.push({
				name: `${i + 1}: ${option}`,
				value: 'Votes: 0',
			});
			dbOptionVotes.push(0);
		}

		client.api.webhooks(client.user.id, interaction.token).messages('@original').get()
			.then((res) => {
				const users = client.guilds.cache
					.get(interaction.guild_id).roles.cache
					.get(interaction.data.options[0].options[0].value).members
					.map((m) => m.user.id);

				new Poll({
					_id: uid,
					guildId: interaction.guild_id,
					channelId: interaction.channel_id,
					messageId: res.id,
					pollType: 'role',
					pollStyle: 1,
					optionVotes: dbOptionVotes,
					pendingVoters: users,
					submittedVoters: [],
				}).save();

				new Discord.WebhookClient(client.user.id, interaction.token).send({
					allowed_mentions: [{
						replied_user: true,
						parse: [
							'roles',
							'users',
							'everyone',
						],
					}],
					embeds: [{
						type: 'rich',
						title: interaction.data.options[0].options[1].value,
						description: `Poll for <@&${interaction.data.options[0].options[0].value}>\n**Duration:** ${interaction.data.options[0].options[2].value} Hours\n\nOptions:`,
						color: 0x00FFFF,
						fields: fieldsList,
						footer: {
							text: 'Pain.exe',
						},
					}],
					components: [
						{
							type: 1,
							components: buttonList,
						},
					],
				});
			});

		setTimeout(async () => {
			client.api.webhooks(client.user.id, interaction.token).messages('@original').get()
				.then(async (res) => {
					// eslint-disable-next-line max-len
					const poll = await Poll.findOne({ messageId: res.id, guildId: interaction.guild_id })
						.exec()
						.catch((err) => {
							// eslint-disable-next-line no-console
							console.log(`Error: ${err}`);
						});

					if (!poll) return;

					// eslint-disable-next-line max-len
					client.guilds.cache.get(poll.guildId).channels.cache.get(poll.channelId).messages.fetch(poll.messageId)
						.then((message) => {
							const msgEmbed = message.embeds[0];

							message.edit({
								embeds: [{
									type: 'rich',
									title: `**POLL ENDED:** ${interaction.data.options[0].options[1].value}`,
									description: `Poll For <@&${interaction.data.options[0].options[0].value}>\n\nResults:`,
									color: 0x00FFFF,
									fields: msgEmbed.fields,
									footer: {
										text: 'Pain.exe',
									},
								}],
								components: [],
							});
						});

					poll.remove();
				})
				.catch(async (err) => {
					// eslint-disable-next-line no-console
					console.log(err);
					const poll = await Poll.findOne({ _id: uid })
						.exec()
						.catch((err2) => {
							// eslint-disable-next-line no-console
							console.log(`Error: ${err2}`);
						});

					if (!poll) return;

					poll.remove();
				});
		}, interaction.data.options[0].options[2].value * 60 * 1000);
	}
};

exports.buttonHandler = async (Discord, client, interaction) => {
	client.api.interactions(interaction.id, interaction.token)
		.callback
		.post({ data: { type: 7 } });

	// eslint-disable-next-line max-len
	const poll = await Poll.findOne({ messageId: interaction.message.id, guildId: interaction.guild_id })
		.exec()
		.catch((err) => {
			// eslint-disable-next-line no-console
			console.log(`Error: ${err}`);
		});

	if (!poll) return;

	if (poll.pollType === 'server') {
		if (poll.submittedVoters.includes(interaction.member.user.id)) return;

		const number = parseInt(interaction.data.custom_id.split('_')[1], 10) - 1;
		poll.optionVotes.set(number, poll.optionVotes[number] + 1);
		poll.submittedVoters.push(interaction.member.user.id);
		await poll.save();

		// eslint-disable-next-line max-len
		client.guilds.cache.get(poll.guildId).channels.cache.get(poll.channelId).messages.fetch(poll.messageId)
			.then((message) => {
				const msgEmbed = message.embeds[0];

				msgEmbed.fields[number].value = `Votes: ${poll.optionVotes[number]}`;

				message.edit({ embeds: [msgEmbed] });
			});
	}
	if (poll.pollType === 'role') {
		// eslint-disable-next-line max-len
		if (poll.submittedVoters.includes(interaction.member.user.id) || !poll.pendingVoters.includes(interaction.member.user.id)) return;

		const number = parseInt(interaction.data.custom_id.split('_')[1], 10) - 1;
		const voterIndex = poll.pendingVoters.indexOf(interaction.member.user.id);
		poll.optionVotes.set(number, poll.optionVotes[number] + 1);
		poll.pendingVoters.splice(voterIndex, 1);
		poll.submittedVoters.push(interaction.member.user.id);
		await poll.save();

		// eslint-disable-next-line max-len
		client.guilds.cache.get(poll.guildId).channels.cache.get(poll.channelId).messages.fetch(poll.messageId)
			.then((message) => {
				const msgEmbed = message.embeds[0];

				msgEmbed.fields[number].value = `Votes: ${poll.optionVotes[number]}`;

				message.edit({ embeds: [msgEmbed] });
			});

		if (poll.pendingVoters.length === 0) {
			// eslint-disable-next-line max-len
			client.guilds.cache.get(poll.guildId).channels.cache.get(poll.channelId).messages.fetch(poll.messageId)
				.then((message) => {
					const msgEmbed = message.embeds[0];

					message.edit({
						embeds: [{
							type: 'rich',
							title: `**POLL ENDED:** ${msgEmbed.title}`,
							description: `Poll For <@&${msgEmbed.description.split('>')[0].slice(12, 30)}>\n\nResults:`,
							color: 0x00FFFF,
							fields: msgEmbed.fields,
							footer: {
								text: 'Pain.exe',
							},
						}],
						components: [],
					});
				});

			poll.remove();
		}
	}
};

exports.config = {
	type: 'guild',
	command: 'poll',
	buttons: [
		'poll:option_1',
		'poll:option_2',
		'poll:option_3',
		'poll:option_4',
		'poll:option_5',
		'poll:option_6',
		'poll:option_7',
		'poll:option_8',
		'poll:option_9',
		'poll:option_10',
	],
};
