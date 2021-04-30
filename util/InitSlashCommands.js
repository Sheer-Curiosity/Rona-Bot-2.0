/* eslint-disable no-async-promise-executor */
exports.initGuildSlashCommand = (client, guild, command) => new Promise(async (resolve, reject) => {
	client.api.applications(client.user.id).guilds(guild.id).commands.post({
		data: command.data,
	})
		.then((res) => {
			client.api.applications(client.user.id).guilds(guild.id).commands(res.id).permissions.put({
				data: command.permissions,
			})
				.then(() => {
					resolve();
				})
				.catch((err) => {
					reject(new Error(err));
				});
		})
		.catch((err) => {
			reject(new Error(err));
		});
});

exports.initGlobalSlashCommand = (client, command) => new Promise(async (resolve, reject) => {
	client.api.applications(client.user.id).commands.post({
		data: command,
	})
		.then(() => {
			resolve();
		})
		.catch((err) => {
			reject(new Error(err));
		});
});
