const { Events } = require('discord.js');
//const r = (string = '', regexp) => !!(string.match(regexp));

module.exports = {
	name: Events.MessageCreate,
	once: false,
	execute(message) {
		// THIS CODE IS EXAMPLE CODE. IT **ISN'T** GOING TO GIVE BAD INFLUENCE TO THE APP,
		// BUT THIS CODE HASN'T MEANING. SO, I DON'T RECOMMEND ACTIVATE THIS CODE.
		//if(message.content.match(/^o\/ping/)) message.reply('Pong!')
		if(message.content.match(/^o\//)) resolveCommand(message, message.content)
	},
};

function resolveCommand(message, command = '') {
	let fullCommandArr = command.split(' ');
	let call = fullCommandArr.shift();
	call = call.replace('o/', '');
	let subcommand = '';
	if (!fullCommandArr[0] || fullCommandArr[0].match(/^\-/)) { subcommand = null } else { subcommand = fullCommandArr.shift() };
	const args = fullCommandArr;

	switch(call) {
		case 'omikuji': {
			require('../commands/japanese-culture/omikuji').execute(message, 'messageCreate'); break;
		}
		case 'dice': {
			require('../commands/japanese-culture/dice').execute(
				Object.assign(
					message,
					{options: {
						getInteger: (arg) => {
							try {
								switch(arg) {
									case 'size': return parseInt(args[args.findIndex(v => v.match(/^-s/))].replace('-s', ''));
									case 'count': return parseInt(args[args.findIndex(v => v.match(/^-c/))].replace('-c', ''));
								}
							} catch(e) {console.error(e)}
						}
					}}
				)
			)
		}
	}
}