function pfpRoulette() {
client.on('message', message => {
    if (message.content === '-RonaRoulette' && message.member.roles.cache.some(role => role.name === 'Admin boi') === true) {
    var PFParray = Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13);
    var PFP = PFParray[Math.floor(Math.random() * PFParray.length)];
    switch (PFP) {
        case 0:
            client.user.setAvatar('./pfp-roulette/aki.jpg')
            message.channel.send('PFP Chosen: Aki Rosenthal');
            console.log('PFP Chosen:', `${PFP},`, 'Which is: Aki Rosenthal');
            break;
        case 1:
            client.user.setAvatar('./pfp-roulette/botan.jpg')
            message.channel.send('PFP Chosen: Shishiro Botan');
            console.log('PFP Chosen:', `${PFP},`, 'Which is: Shishiro Botan');
            break;
        case 2:
            client.user.setAvatar('./pfp-roulette/coco.jpg')
            message.channel.send('PFP Chosen: Kiryu Coco');
            console.log('PFP Chosen:', `${PFP},`, 'Which is: Kiryu Coco');
            break;
        case 3:
            client.user.setAvatar('./pfp-roulette/fubuki.jpg')
            message.channel.send('PFP Chosen: Shirakami Fubuki');
            console.log('PFP Chosen:', `${PFP},`, 'Which is: Shirakami Fubuki');
            break;
        case 4:
            client.user.setAvatar('./pfp-roulette/gura.jpg')
            message.channel.send('PFP Chosen: Gawr Gura');
            console.log('PFP Chosen:', `${PFP},`, 'Which is: Gawr Gura');
            break;
        case 5:
            client.user.setAvatar('./pfp-roulette/haachama.jpg')
            message.channel.send('PFP Chosen: Akai Haato (Haachama)');
            console.log('PFP Chosen:', `${PFP},`, 'Which is: Akai Haato (Haachama)');
            break;
        case 6:
            client.user.setAvatar('./pfp-roulette/ina.jpg')
            message.channel.send(`PFP Chosen: Ninomae Ina'nis`);
            console.log('PFP Chosen:', `${PFP},`, `Which is: Ninomae Ina'nis`);
            break;
        case 7:
            client.user.setAvatar('./pfp-roulette/korone.jpg')
            message.channel.send('PFP Chosen: Inugami Korone');
            console.log('PFP Chosen:', `${PFP},`, 'Which is: Inugami Korone');
            break;
        case 8:
            client.user.setAvatar('./pfp-roulette/marine.jpg')
            message.channel.send('PFP Chosen: Houshou Marine');
            console.log('PFP Chosen:', `${PFP},`, 'Which is: Houshou Marine');
            break;
        case 9:
            client.user.setAvatar('./pfp-roulette/mio.jpg')
            message.channel.send('PFP Chosen: Ookami Mio');
            console.log('PFP Chosen:', `${PFP},`, 'Which is: Ookami Mio');
            break;
        case 10:
            client.user.setAvatar('./pfp-roulette/nakiri.jpg')
            message.channel.send('PFP Chosen: Nakiri Ayame');
            console.log('PFP Chosen:', `${PFP},`, 'Which is: Nakiri Ayame');
            break;
        case 11:
            client.user.setAvatar('./pfp-roulette/roboco.jpg')
            message.channel.send('PFP Chosen: Roboco-san');
            console.log('PFP Chosen:', `${PFP},`, 'Which is: Roboco-san');
            break;
        case 12:
            client.user.setAvatar('./pfp-roulette/sora.jpg')
            message.channel.send('PFP Chosen: Tokino Sora');
            console.log('PFP Chosen:', `${PFP},`, 'Which is: Tokino Sora');
            break;
        case 13:
            client.user.setAvatar('./pfp-roulette/watame.jpg')
            message.channel.send('PFP Chosen: Tsunomaki Watame');
            console.log('PFP Chosen:', `${PFP},`, 'Which is: Tsunomaki Watame');
            break;
        }
    }
});
}

module.exports = {
    pfpRoulette: function () {
        pfpRoulette();
    }
}