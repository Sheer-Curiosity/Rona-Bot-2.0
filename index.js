const { prefix, token } = require('./config.json');
const fs = require('fs');
const pfpScript = require('./pfp-roulette/pfp-roulette.js');
const fukkireta = require('./EasterEgg/fukkireta.js');
const utility = require('./scripts/grabid.js');
const ytPlayer = require('./scripts/playfromyoutube.js');
const apexTracker = require('./scripts/apexStatTrack.js');
const Discord = require('discord.js');
const client = new Discord.Client();
var playing = false; //Used to prevent songs from being overlapped
global.globalPlaying = playing;
global.client = client; 

client.login(token);
client.once('ready', () => {
	console.log('Ready!');
	currentActivity = `TESTING`
	client.user.setActivity(currentActivity);
});

/* In theory I could streamline all these assorted functions by making
one "on message" event here and exporting the message variable to each
of the functions. Gonna leave this here because I might do that in the
future */

apexTracker.apexGrabInfo();

pfpScript.pfpRoulette(); //command for changing the bot's PFP

//YT Video Player
ytPlayer.ytPlay();
ytPlayer.ytLoop();

//Hololive songs easter egg(s)
fukkireta.globalInterruptPlay();
fukkireta.playFukkireta();
fukkireta.playAlien();
fukkireta.playAhoy();

function grabId(mention) {  //couldn't figure out how to put this in a seperate file, so here it is in the main file.
	if (!mention) return;
	
    if (mention.startsWith('<@') && mention.endsWith('>')) {
		mention = mention.slice(2, -1);
		if (mention.startsWith('!')) {
			mention = mention.slice(1);
		}
        return client.users.cache.get(mention);
    }
    else {
        return client.users.cache.get(mention);
    }
}

client.on('message', async message => {
if (!message.content.startsWith(prefix) || message.author.bot || message.guild === null) return;

const withoutPrefix = message.content.slice(prefix.length);
const split = withoutPrefix.split(/ +/);
const command = split[0];
const args = split.slice(1);

switch (command) {
	case 'mute':
		if (message.member.roles.cache.some(role => role.name === 'Admin boi', 'Bippity Boppity This servers my property') === false) return;
		const user = grabId(args[0]);
	
		if (!user) {
			console.log(user);
			return message.channel.send('Invalid Syntax');
		}
		if (message.guild.member(user).roles.cache.some(role => role.name === 'Admin boi') === true) {
			return message.channel.send('You Cannot Mute A Fellow Admin or Yourself');
		}
		if (message.guild.member(user).voice.channel === null) {
			return message.channel.send('User Is Not In A Voice Channel');
		}
		if (message.guild.member(user).voice.channel != null) {
			message.guild.member(user).voice.setChannel('760711348391903253');
			client.user.setActivity('Beating The Prisoner');
		}
		else {
			message.channel.send('An unknown error has occured.')
		}
		break;
	case 'user':
		if (message.member.roles.cache.some(role => role.name === 'Admin boi') === false) return;
		message.channel.send('null');
		break;
	case 'unmute':
		if (message.member.roles.cache.some(role => role.name === 'Admin boi') === false) return;
		client.user.setActivity(currentActivity);
		break;
	case `bri'ish`:
		message.channel.send("Blimey mate, 'least I don't get shot while dewin maffs in skewl, plus you Americans don't even got free 'elfcare... pretty schtewpid innit?");
		break;
}
});
client.on('error', console.error);

