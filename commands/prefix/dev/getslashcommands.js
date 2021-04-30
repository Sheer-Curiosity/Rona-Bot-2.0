//
// eslint-disable-next-line consistent-return
exports.run = async (client, message, args) => {
	if ((args[1]) || (args[0] !== 'all' && args[0] !== 'guild' && args[0] !== 'global')) return message.reply('Error. Contact dev for details.');
	const reply = await message.reply('Loading...');
	if (args[0] === 'global') {
		await reply.edit('Currently Registered Global Slash Commands:\n');
		client.api.applications(client.user.id).commands.get()
			.then((res) => {
				let rep = '';
				for (let i = 0; i < res.length; i += 1) {
					rep += (`/${res[i].name}\n`);
				}
				reply.edit(`${reply.content}\n${rep}`);
			});
	}
	if (args[0] === 'guild') {
		await reply.edit('Currently Registered Guild Slash Commands:\n');
		client.api.applications(client.user.id).guilds(message.guild.id).commands.get()
			.then((res) => {
				let rep = '';
				for (let i = 0; i < res.length; i += 1) {
					rep += (`/${res[i].name}\n`);
				}
				reply.edit(`${reply.content}\n${rep}`);
			});
	}
	if (args[0] === 'all') {
		await reply.edit('Currently Registered Global Slash Commands:');
		await client.api.applications(client.user.id).commands.get()
			.then((res) => {
				let rep = '';
				for (let i = 0; i < res.length; i += 1) {
					rep += (`/${res[i].name}\n`);
				}
				reply.edit(`${reply.content}\n${rep}`);
			});
		await reply.edit(`${reply.content}\nCurrently Registered Guild Slash Commands:\n`);
		await client.api.applications(client.user.id).guilds(message.guild.id).commands.get()
			.then((res) => {
				let rep = '';
				for (let i = 0; i < res.length; i += 1) {
					rep += (`/${res[i].name}\n`);
				}
				reply.edit(`${reply.content}\n${rep}`);
			});
	}
};

exports.config = {
	command: 'getSlashCommands',
};
