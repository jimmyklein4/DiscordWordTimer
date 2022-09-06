import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('shling')
    .setDescription('Replies with Schlong');
export async function execute(interaction) {
    await interaction.reply('Schlong');
}