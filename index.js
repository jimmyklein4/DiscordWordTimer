import { Client, GatewayIntentBits } from 'discord.js';
import { readFileSync } from 'fs';
// import token  from './auth.json' assert {type:'json'};
const token = JSON.parse(readFileSync('./auth.json'));

import { createMessage } from './messageCreator.js';
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once('ready', c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
	console.log(client.guilds);
});

// TODO: Move this to its own method/file or something
client.on('messageCreate', message => createMessage(message));

client.on('interactionCreate', async interaction =>{
	if (!interaction.isChatInputCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'ping') {
		await interaction.reply('Pong');
	}
});

client.login(token.token);
