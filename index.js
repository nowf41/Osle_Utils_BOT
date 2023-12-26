const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ intents: [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.MessageContent,
] });

client.commands = new Collection();

// コマンドファイル動的取得
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// イベントトリガー動的取得
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// THIS IS AN TEST CODE FOR RESOLVE AN ISSUE. IF YOU FOUND THIS CODE ACTIVATED IN RELEASE VERSION,
// PLEASE REPORT ME(https://nowf41.github.io/).
// THE ISSUE HAS RESOLVED. DO **NOT** ACTIVATE THIS CODE BECAUSE WHEN RUN THIS CODE, THE BOT WILL
// MAKE DUPLICATE REACTS.

// THIS CODE IS GOING TO BE DELETED IN FUTURE VERSION.
/*
client.on(Events.MessageCreate, async message => {
	console.log('Event messageCreate Was Happend. Message.content: ', message.content);
	if(message.author.bot) return;
	if(message.content.match(/^o\/ping/)) { await message.reply('Pong!').then(() => console.log('sent pong.')) };
})
*/

// BOTログイン
client.login(token);