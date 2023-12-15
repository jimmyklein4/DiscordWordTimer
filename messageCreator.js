import { readFileSync } from 'fs';
import { writeFile } from 'fs';

const config = JSON.parse(readFileSync('./config.json'));

export function createMessage(message) {
    console.log(message);
	if (message.author.bot) {
		return;
	}

	let haveGuildInConfig = false;
	for (let i = 0; i < config.guilds.length; i++) {
		if (config.guilds[i].id === message.guildId) {
			const searchWord = config.guilds[i].searchWord;
			// const regex = /(\sword\s|^word\s|\sword$|^word$|\sword\W|^word\W)/i;
			haveGuildInConfig = true;
			// 60,000 is amount of ms in a minute
			if (isMessageGood(message.content, searchWord) && Date.now() - config.guilds[i].timer > config.guilds[i].cooldownTimerMinutes * 60000) {
				console.log('Should send message');
				const timeSinceLastMessage = Date.now() - config.guilds[i].timer;
				const responseMessage = 'Time since last ' + searchWord + ': ' + formattedTime(timeSinceLastMessage);
				message.channel.send(responseMessage);
				config.guilds[i].timer = Date.now();
				if(config.guilds[i].longesttime && config.guilds[i].longesttime < timeSinceLastMessage) {
					config.guilds[i].longesttime = timeSinceLastMessage;
				} else if(!config.guilds[i].longesttime) {
					config.guilds[i].longesttime = timeSinceLastMessage;
				}

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

function isMessageGood(message, searchWord) {
	if(!searchWord) {
		searchWord = 'test';
	}
	const regex = new RegExp('^.*?(?:\\s|^|\\W)(' + searchWord + ')(?=\\W|$).*', 'i');
	return regex.test(message);
}

function formattedTime(lastMessageTime) {
    return (Math.floor(lastMessageTime / 86400000) + ' days, ' +
    Math.floor((lastMessageTime % 86400000) / 3600000) + ' hours, ' +
    Math.floor((lastMessageTime % 3600000) / 60000) + ' minutes, ' +
    Math.floor((lastMessageTime % 60000) / 1000) + ' seconds');
}