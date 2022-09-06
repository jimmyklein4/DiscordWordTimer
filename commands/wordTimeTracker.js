import { SlashCommandBuilder } from 'discord.js';
import { readFileSync } from 'fs';
import { formattedTime } from '../messageFormatter.js';
const config = JSON.parse(readFileSync('./config.json'));

export const data = new SlashCommandBuilder()
    .setName('currentwordrecord')
    .setDescription('Longest time target word has not been said');
export async function execute(interaction) {
    for(let i = 0; i < config.guilds.length; i++) {
        if (config.guilds[i].id === interaction.guildId) {
            const longestTime = config.guilds[i].longesttime;
            if(!longestTime) {
                await interaction.reply('No record at this time.');
            } else {
                await interaction.reply('Current record: ' + formattedTime(longestTime));
            }
            break;
        }
    }
}