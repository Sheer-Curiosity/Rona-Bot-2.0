const ytdl = require('ytdl-core-discord');
const { prefix } = require('../config.json');
const validUrl = require('valid-url');
globalPlaying = false;
var loop = false;

function ytLoop() {
    client.on('message', async message => {
        if (!message.content.startsWith(prefix) || message.author.bot || message.guild === null) return;
        if (message.content === '-ytLoop') {
            if (loop === true) {
                loop = false;
                console.log(`>Looping = ${loop}`);
                message.channel.send('Looping: `Disabled`');
                return;
            }
            if (loop === false) {
                loop = true;
                console.log(`>Looping = ${loop}`);
                message.channel.send('Looping: `Enabled`');
                return;
            }
            else {
                return;
            }
        }
        else {
            return;
        }
    })
}

async function playVideo(video, message) {
    try {
        const connection = await message.member.voice.channel.join();
        const dispatcher = connection.play(await ytdl(video), {
            type: 'opus',
            bitrate: 192000, 
            volume: 0.7
        });
        dispatcher.on('start', () => {
            globalPlaying = true;
            console.log('>Linked Video Is Looping');
        });
        dispatcher.on('finish', () => {
            if (loop === true) {
                playVideo(video, message);
            }
            else {
                globalPlaying = false;
                console.log('>Linked Video Has Finished Playing');
                connection.disconnect();
            }
        });
        return;
    }
    catch(err) {
        console.log(err);
        message.channel.send(`${err}.`);
        return;
    }
}

function ytPlay() {
    client.on('message', async message => {
        if (!message.content.startsWith(prefix) || message.author.bot || message.guild === null) return;

                const withoutPrefix = message.content.slice(prefix.length);
                const split = withoutPrefix.split(/ +/);
                const command = split[0];
                const args = split.slice(1);
    
                if (command === 'yt') {
                    if (message.member.voice.channel) {
                        const link = (args[0]);
                        if (validUrl.isUri(link)) {
                            if (link.includes('https://www.youtube.com/watch?v=') || link.includes('https://youtu.be/')) {
                                console.log ('>Link Is A youtube.com Link')
                                if (link.includes('https://www.youtube.com/watch?v=')) {
                                    const vidId = link.slice(32);
                                    if (vidId.length !== 11) {
                                        console.log('>Invalid YT Video ID; Returned');
                                        message.channel.send('Invalid YT Video ID')
                                        return;
                                    }
                                    if (globalPlaying === true) {
                                        console.log('>A YT Video Is Already Playing; Returned');
                                        message.channel.send('A YT Video Is Already Playing')
                                        return;
                                    }
                                    else {
                                        try {
                                        const connection = await message.member.voice.channel.join();
                                        message.channel.send('Processing...');
                                        const dispatcher = connection.play(await ytdl(link), {
                                            type: 'opus',
                                            bitrate: 192000, 
                                            volume: 0.7
                                        });
                                        dispatcher.on('start', () => {
                                            globalPlaying = true;
                                            console.log('>Linked Video Is Playing');
                                            message.channel.send('Playing!')
                                        });
                                        dispatcher.on('finish', () => {
                                            if (loop === true) {
                                                playVideo(link, message)
                                            }
                                            else {
                                                globalPlaying = false;
                                                console.log('>Linked Video Has Finished Playing');
                                                connection.disconnect();
                                            }
                                        });
                                        return;
                                        }
                                        catch(err) {
                                            console.log(err);
                                            message.channel.send(`${err}.`);
                                            return;
                                        } 
                                    }
                                }
                                if (link.includes('https://youtu.be/')) {
                                    const vidId = link.slice(17);
                                    if (vidId.length !== 11) {
                                        console.log('>Invalid YT Video ID; Returned');
                                        message.channel.send('Invalid YT Video ID')
                                        return;
                                    }
                                    if (globalPlaying === true) {
                                        console.log('>A YT Video Is Already Playing; Returned');
                                        message.channel.send('A YT Video Is Already Playing')
                                        return;
                                    }
                                    else {
                                        try {
                                        const connection = await message.member.voice.channel.join();
                                        message.channel.send('Processing...')
                                        const dispatcher = connection.play(await ytdl(link), {
                                            type: 'opus', 
                                            bitrate: 192000, 
                                            volume: 0.7
                                        });
                                        dispatcher.on('start', () => {
                                            globalPlaying = true;
                                            console.log('>Linked Video Is Playing');
                                            message.channel.send('Playing!')
                                        });
                                        dispatcher.on('finish', () => {
                                            if (loop === true) {
                                                playVideo(link, message)
                                            }
                                            else {
                                                globalPlaying = false;
                                                console.log('>Linked Video Has Finished Playing');
                                                connection.disconnect();
                                            }
                                        });
                                        return;
                                        }
                                        catch(err) {
                                            console.log(err);
                                            message.channel.send(`${err}.`);
                                            return;
                                        }
                                    }
                                }
                            }
                            else {
                                console.log('>Link Is Not A Youtube Link; Returned')
                                message.channel.send('Link Is Not A Youtube Link; Returned')
                                return;
                            }
                        }
                        else {
                            console.log('>Inputted Text Is Not A Link; Returned')
                            message.channel.send('Inputted Text Is Not A Link; Returned')
                            return;
                        }
                    }
                    else {
                        message.channel.send('You Are Not In A Voice Channel; Please Enter A Voice Channel And Run The Command Again')
                        return;
                    }
                }
                else {
                    return;
                }
        });
}

module.exports = {
    ytPlay: function () {
        ytPlay();
    },
    ytLoop: function () {
        ytLoop();
    }
}