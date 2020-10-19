const fs = require('fs');
const Discord = require('discord.js');

const config = require('./config.json');
const auth = require('./auth.json');
const client = new Discord.Client();

client.once('ready', () => {
	console.log('ready!');
});

if(config.timer == '') {
	config.timer = Date.now();
	fs.writeFile('config.json', JSON.stringify(config), function(err) {
		if(err) {
			console.log(err);
		}
	});
}

client.on('message', message => {
	const regex = /(\scum\s|^cum\s|\scum$|^cum$)/;
	if(regex.test(message.content)) {
		const timeSinceLastCum = Date.now() - config.timer;
		const responseMessage = require('./messageFormatter.js').getFormattedMessage(timeSinceLastCum);
		message.channel.send(responseMessage);
		config.timer = Date.now();
		fs.writeFile('config.json', JSON.stringify(config), function(err) {
			if(err) {
				console.log(err);
			}
		});
	}
});

client.login(auth.token);
