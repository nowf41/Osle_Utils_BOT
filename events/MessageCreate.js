const { Events } = require('discord.js');
//const r = (string = '', regexp) => !!(string.match(regexp));

module.exports = {
	name: Events.MessageCreate,
	once: false,
	execute(message) {
		if(message.content.match(/^o\/ping/)) message.reply('Pong!')
	},
};