import { Client, Intents } from 'discord.js';
import { readFileSync } from 'fs';
// import token  from './auth.json' assert {type:'json'};
const token = JSON.parse(readFileSync('./auth.json'));

import { createMessage } from './messageCreator.js';
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.once('ready', c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
	console.log(client.guilds);
});

// TODO: Move this to its own method/file or something
client.on('messageCreate', message => createMessage(message));

client.login(token.token);
