import { REST } from '@discordjs/rest';
import { Routes } from 'discord.js';
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'url';
import * as path from 'node:path';
// import { url } from 'node:inspector';
const auth = JSON.parse(readFileSync('./auth.json'));

const commands = [];
const commandsPath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'commands');
const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    console.log(filePath);
    const command = await import(filePath);
    console.log(command.data);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(auth.token);

rest.put(
    Routes.applicationCommands(auth.clientID),
    { body: commands })
    .then((data) => console.log(`Registered ${data.length} commands`))
    .catch(console.error);