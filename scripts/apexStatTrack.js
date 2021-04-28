const { prefix, apexApi } = require('../config.json');
const Discord = require('discord.js');
const request = require('request');
output = null;

//This API can suck my ass, it's horrible. Really I only have Apex to blame for having just horrenous endpoints.

function apexGrabInfo() {
client.on('message', message => {
    if (message.guild === null) return;
    if (message.author.bot) return;

        const withoutPrefix = message.content.slice(prefix.length);
        const split = withoutPrefix.split(/ +/);
        const command = split[0];
        const args = split.slice(1);

        if (command === 'ApexStats') {
            const platform = args[0];
            var player = (`${args[1]}`);
            const platformArray = Array('origin', 'xbl', 'psn')
            if (args[0] === 'help') {
                message.channel.send("Command Format: `-ApexStats (Platform) (Player Username)` \nValid Platforms: `origin, xbl, psn`")
                return;
            }
            if (args[3]) {
                message.channel.send('Incorrect Number of Arguments')
                return;
            }
            if (args[0] === 'xbl') {
                if (args[2]) {
                    player = (`${args[1]} ${args[2]}`)
                }
                else {
                    player = (`${args[1]}`)
                }
            }
            if (args[1]) {
                if (platformArray.includes(args[0])) {
                    console.log('valid')
                    request.get({
                        headers: {
                            "content-type" : "application/json",
                            "TRN-Api-Key": `${apexApi}`
                        },
                        url: `https://public-api.tracker.gg/v2/apex/standard/profile/${platform}/${player}`
                    }, function(error, response, body){
                        output = JSON.parse(body)
                        console.log(output)
                        if (output.hasOwnProperty('errors')) {
                            message.channel.send('Invalid Username');
                            console.log('error');
                            return;
                        }
                        if (output.hasOwnProperty('data')) {
                            const name = (output.data.platformInfo.platformUserId);
                            const userPfp = (output.data.platformInfo.avatarUrl);
                            const level = (output.data.segments[0].stats.level.displayValue);
                            const lifetimeKills = (output.data.segments[0].stats.kills.displayValue);
                            const currentLegend = (output.data.metadata.activeLegendName);
                            const legendUrl = (output.data.segments[1].metadata.tallImageUrl);
                            if (output.data.segments[1].stats.kills === undefined) {
                                currentLegendKills = 'Unable To Retrieve'
                            }
                            else {
                                currentLegendKills = (output.data.segments[1].stats.kills.displayValue);
                            }

                            const exampleEmbed = new Discord.MessageEmbed()
                                .setColor('#ff0000')
                                .setTitle('Apex Stat Tracker')
                                .setDescription(`Stats For: ${name} (May Not Be Current)`)
                                .setThumbnail(`${userPfp}`)
                                .setImage(`${legendUrl}`)
                                .addFields(
                                    { name: 'Current Level', value: `${level}`, inline: true },
                                    { name: 'Lifetime Kills', value: `${lifetimeKills}`, inline: true },
                                    { name: '\u200b', value: `\u200b` },
                                    { name: 'Current Legend', value: `${currentLegend}`, inline: true },
                                    { name: 'Legend Kills', value: `${currentLegendKills}`, inline: true },
                                )
                                .setTimestamp()
                                .setFooter("Powered by: Haachama KFC ASMR");

                            message.channel.send(exampleEmbed)
                            return;
                            }
                    });
                }
                else {
                    console.log('invalid');
                    message.channel.send('Invalid Platform');
                    return;
                }
            }
            else {
                message.channel.send('Incorrect Number of Arguments')
                return;
            }
        }
        else {
            return;
        }
});
}

module.exports = {
    apexGrabInfo: function() {
        apexGrabInfo();
    }
}