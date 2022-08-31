const fs = require('fs');
const { Client, Intents } = require('discord.js');

const config = require('./config.json');
const auth = require('./auth.json');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.once('ready', c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
	console.log(client.guilds);
});

client.on('messageCreate', message => {
	console.log(message);
	if (message.author.bot) {
		return;
	}

	let haveGuildInConfig = false;
	for (let i = 0; i < config.guilds.length; i++) {
		if (config.guilds[i].id === message.guildId) {
			let searchWord = config.guilds[i].searchWord;
			console.log(searchWord);
			if(!searchWord) {
				searchWord = 'test';
			}
			const regex = new RegExp('\\s' + searchWord + '\\s|^' + searchWord + '\\s|\\s' + searchWord + '$|^' + searchWord + '$|\\s' + searchWord + '\\W|^' + searchWord + '\\W', 'i');
			// const regex = /(\sword\s|^word\s|\sword$|^word$|\sword\W|^word\W)/i;
			haveGuildInConfig = true;
			// 60,000 is amount of ms in a minute
			console.log(regex);
			if (regex.test(message.content) && Date.now() - config.guilds[i].timer > config.guilds[i].cooldownTimerMinutes * 60000) {
				const timeSinceLastMessage = Date.now() - config.guilds[i].timer;
				const responseMessage = require('./messageFormatter.js').getFormattedMessage(timeSinceLastMessage);
				message.channel.send(responseMessage);
				config.guilds[i].timer = Date.now();
				fs.writeFile('config.json', JSON.stringify(config), function(err) {
					if (err) {
						console.log(err);
					}
				});
			}
		}
	}

	if (!haveGuildInConfig) {
		config.guilds.push({ id : message.guildId, prefix: '!', timer: Date.now(), cooldownTimerMinutes: 1 });
		fs.writeFile('config.json', JSON.stringify(config), function(err) {
			if (err) {
				console.log(err);
			}
		});
	}
});

client.login(auth.token);
