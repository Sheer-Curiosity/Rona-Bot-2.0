const fs = require('fs');
const initslashcommands = require('../../../util/InitSlashCommands.js');

// eslint-disable-next-line consistent-return
exports.run = async (client, message, args) => {
	if (args[0]) return message.reply('Error: this command doesn\'t take arguments');

	fs.readdir('./commands/slash/dev', (err, files) => {
		if (err) throw (err);
		const slashFiles = files.filter((f) => f.split('.').pop() === 'js');
		if (slashFiles.length <= 0) {
			message.reply('No slash commands found');
		}
		slashFiles.forEach((f) => {
			delete require.cache[require.resolve(`../../slash/dev/${f}`)];
			// eslint-disable-next-line global-require,import/no-dynamic-require
			const cmd = require(`../../slash/dev/${f}`);
			if (cmd.config.type === 'guild') {
				initslashcommands.initGuildSlashCommand(client, message.guild, cmd);
				client.devGuildSlashCommands.set(cmd.config.command, cmd);
			} else {
				delete require.cache[require.resolve(`../../slash/dev/${f}`)];
			}
		});
		message.reply('Done!');
	});
};

exports.config = {
	command: 'initGuildSlashCommands',
};
