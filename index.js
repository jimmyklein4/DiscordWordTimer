import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'url';
import * as path from 'node:path';
// import token  from './auth.json' assert {type:'json'};
const token = JSON.parse(readFileSync('./auth.json'));

import { createMessage } from './messageCreator.js';

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
client.commands = new Collection();
const commandsPath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'commands');
const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = await import(filePath);

	client.commands.set(command.data.name, command);
}

client.once('ready', c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
	console.log(client.guilds);
});

// TODO: Move this to its own method/file or something
client.on('messageCreate', message => createMessage(message));

client.on('interactionCreate', async interaction =>{
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch(error) {
		await interaction.reply({ content: 'There was an error while executing this command', ephemeral: true });
	}
});

client.login(token.token);
