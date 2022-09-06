import { REST } from '@discordjs/rest';
import { SlashCommandBuilder, Routes } from 'discord.js';
import { readFileSync } from 'fs';
const auth = JSON.parse(readFileSync('./auth.json'));

const commands = [
    new SlashCommandBuilder().setName('ping').setDescription('Replies with ping')
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(auth.token);

rest.put(
    Routes.applicationCommands(auth.clientID),
    { body: commands })
    .then((data) => console.log(`Registered ${data.length} commands`))
    .catch(console.error);