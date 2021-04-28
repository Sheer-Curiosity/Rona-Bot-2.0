function globalInterruptPlay() {
    client.on('message', async message => {
        try {
        if (message.content === '-stop')
            // No, I can't get rid of the nested if-else statement.
            if (message.guild === null) {
                return;
            }
            else {
                if (!message.guild.voice.connection || globalPlaying === false) {
                    return;
                }    
                else {
                    const connection = await message.member.voice.channel.join();
                    globalPlaying = false;
                    message.channel.send('Rona Bot Has Been Disconnected!');
                    console.log('>Rona Has Been Disconnected');
                    connection.disconnect();
                    return;
                }
            }
        }
        catch(err) {
            console.log(err)
            message.channel.send(`${err}`)
        }
    });
}

function fukkireta() {
    client.on('message', async message => {
    if (message.content === '-fukkireta' && globalPlaying === false && message.guild !== null) {
        try {
		    if (message.member.voice.channel) {
                message.channel.send('https://www.youtube.com/watch?v=9kQ2GtvDV3s');
			    const connection = await message.member.voice.channel.join();
			    const dispatcher = connection.play('./EasterEgg/audio/HololiveFukkireta.mp3', {volume: 1.0, bitrate: 192000});
			    dispatcher.on('start', () => {
                    globalPlaying = true;
				    console.log('>The Hololive Fukkireta Cover Is Playing! Shake Those Hips, Baby!');
			    });
			    dispatcher.on('finish', () => {
                    globalPlaying = false;
				    console.log('>The Hololive Fukkireta Cover Has Finished Playing!');
				    connection.disconnect();
			    });
			    client.on('error', console.error);
			    dispatcher.on('error', console.error);
            }
            else {
                return;
            }
        }
        catch(err) {
            console.log(err)
            message.channel.send(`Encountered Error: ${err}`)
        }
    }
});
}

function alien() {
    client.on('message', async message => {
    if (message.content === '-tokino' && globalPlaying === false && message.guild !== null) {
        try{
		    if (message.member.voice.channel) {
                message.channel.send('https://www.youtube.com/watch?v=NT6Pf28eCgQ');
			    const connection = await message.member.voice.channel.join();
			    const dispatcher = connection.play('./EasterEgg/audio/SoraAlien.mp3', {volume: 0.5, bitrate: 192000});
			    dispatcher.on('start', () => {
                    globalPlaying = true;
				    console.log('>Tokino Sora "Alien Alien" Cover Is Playing! Watashi Alien!');
			    });
			    dispatcher.on('finish', () => {
                    globalPlaying = false;
				    console.log('>Tokino Sora "Alien Alien" Cover Has Finished Playing');
				    connection.disconnect();
			    });
			    client.on('error', console.error);
                dispatcher.on('error', console.error);
            }
            else {
                return;
            }
        }
        catch(err) {
            console.log(err);
            message.channel.send(`Encountered Error: ${err}`)
        }
    }
});
}

function ahoy() {
    client.on('message', async message => {
        if (message.content === '-ahoy!' && globalPlaying === false && message.guild !== null) {
            try{
                if (message.member.voice.channel) {
                    message.channel.send('https://www.youtube.com/watch?v=e7VK3pne8N4');
                    const connection = await message.member.voice.channel.join();
                    const dispatcher = connection.play ('./EasterEgg/audio/MarineAhoy.mp3', {volume: 0.8, bitrate: 192000});
                    dispatcher.on('start', () => {
                        globalPlaying = true;
                        console.log('>Houshou Marine Original Song "Ahoy!!" Is Playing!');
                    });
                    dispatcher.on('finish', () => {
                        globalPlaying = false;
                        console.log('>Houshou Marine Original Song "Ahoy!!" Has Finished Playing!');
                        connection.disconnect();
                    });
                    client.on('error', console.error);
                    dispatcher.on('error', console.error);
                }
                else {
                    return;
                }
            }
            catch(err) {
                console.log(err);
                message.channel.send(`Encountered Error: ${err}`)
            }
        }
    });
}

module.exports = {
    playFukkireta: function () {
        fukkireta();
    },
    playAlien: function () {
        alien();
    },
    playAhoy: function () {
        ahoy();
    },
    globalInterruptPlay: function () {
        globalInterruptPlay();
    },
};