/*
As of right now, this file is NOT being used. However, I am going to
leave it in because I would like to move this function out of index.js
at some point.
*/
function grabId(mention) {
    console.log(mention);
	if (!mention) return;
	
    if (mention.startsWith('<@') && mention.endsWith('>')) {
		mention = mention.slice(2, -1);
		if (mention.startsWith('!')) {
			mention = mention.slice(1);
		}
        cb(client.users.cache.get(mention));
    }
    else {
        cb(client.users.cache.get(mention));
    }
}

module.exports = {
grabId: function (mention) { 
    grabId(mention);
    }
}