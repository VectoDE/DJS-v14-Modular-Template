const { SlashCommandBuilder } = require('discord.js');
const tinyurl = require('tinyurl');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shorturl')
        .setDescription('Shorten a URL')
        .addStringOption(option => option
            .setName('url')
            .setDescription('The URL to shorten.')
            .setRequired(true)
        ),

    async execute(interaction) {
        const url = interaction.options.getString('url');
        tinyurl.shorten(url, function(res, err) {
            if (err)
                return interaction.reply({ content: `Error: ${err}`, ephemeral: true });
            interaction.reply({ content: `Hier ist deine gekürzte URL: ${res}`, ephemeral: true });
        });
    },
};