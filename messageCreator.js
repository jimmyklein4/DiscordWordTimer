import { readFileSync } from 'fs';
// import config from './config.json' assert{type: 'json'};
import { writeFile } from 'fs';
import { getFormattedMessage } from './messageFormatter.js';

const config = JSON.parse(readFileSync('./config.json'));

export function createMessage(message) {
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
			if (regex.test(message.content)) {
				console.log('Message content is good');
			}
			if (regex.test(message.content) && Date.now() - config.guilds[i].timer > config.guilds[i].cooldownTimerMinutes * 60000) {
				console.log('Should send message');
				const timeSinceLastMessage = Date.now() - config.guilds[i].timer;
				const responseMessage = getFormattedMessage(timeSinceLastMessage, searchWord);
				message.channel.send(responseMessage);
				config.guilds[i].timer = Date.now();
				writeFile('config.json', JSON.stringify(config), function(err) {
					if (err) {
						console.log(err);
					}
				});
			}
		}
	}

	if (!haveGuildInConfig) {
		// TODO: Need to add search word config in here
		config.guilds.push({ id : message.guildId, prefix: '!', timer: Date.now(), cooldownTimerMinutes: 1 });
		writeFile('config.json', JSON.stringify(config), function(err) {
			if (err) {
				console.log(err);
			}
		});
	}

}