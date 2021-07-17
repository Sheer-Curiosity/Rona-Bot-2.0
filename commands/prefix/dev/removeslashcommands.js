/* eslint-disable no-console */
// eslint-disable-next-line consistent-return
exports.run = async (client, message, args) => {
	if ((args[1]) || (args[0] !== 'all' && args[0] !== 'guild' && args[0] !== 'global')) return message.reply('Error. Contact dev for details.');
	if (args[0] === 'all' || args[0] === 'global') {
		client.api.applications(client.user.id).commands.get()
			.then((res) => {
				for (let i = 0; i < res.length; i += 1) {
					console.log(`Deleting Global Slash Command "${res[i].name}" (ID: ${res[i].id})`);
					client.api.applications(client.user.id).commands(res[i].id).delete();
				}
			});
	}
	if (args[0] === 'all' || args[0] === 'guild') {
		client.api.applications(client.user.id).guilds(message.guild.id).commands.get()
			.then((res) => {
				for (let i = 0; i < res.length; i += 1) {
					console.log(`Deleting Guild Slash Command "${res[i].name}" (ID: ${res[i].id})`);
					// eslint-disable-next-line max-len
					client.api.applications(client.user.id).guilds(message.guild.id).commands(res[i].id).delete();
				}
			});
	}
	message.reply('Done!');
};

exports.config = {
	command: 'removeSlashCommands',
};
