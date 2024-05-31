const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('url-lookup')
        .setDescription('Get info on a url')
        .addStringOption(option => option.setName('url').setDescription('The url you want to look up.').setRequired(true)),

    async execute (interaction) {
        await interaction.deferReply({ ephemeral: true });

        const { options } = interaction;
        const url = options.getString('url');

        const input = {
            method: 'GET',
            url: 'https://url-lookup-by-api-ninjas.p.rapidapi.com/v1/urllookup',
            params: {
                url: url,
            },
            headers: {
                'X-RapidAPI-Key': '764e85518bmsh67cd3b236e6351ap154e7ajsn3428817eed27',
                'X-RapidAPI-Host': 'url-lookup-by-api-ninjas.p.rapidapi.com'
            },
        };

        try {
            const output = await axios.request(input);

            const embed = new EmbedBuilder()
            .setColor('Purple')
            .setTitle(`Information on ${url}`)
            .setDescription(`> Valid: \`${output.data.is_valid}\` \n> Country: \`${output.data.country}\` \n> Region: \`${output.data.region}\` \n> City: \`${output.data.city}\` \n> Zip Code: \`${output.data.zip}\` \n> Timezone: \`${output.data.timezone}\` \n> ISP: \`${output.data.isp}\` \n> URL: \`${output.data.url}\` \n`)
            .setFooter({ text: 'Ulix | ulixserver.de © 2023 | Alle rechte vorbehalten.' })

            await interaction.editReply({ embeds: [embed] });
        } catch (e) {
            return await interaction.editReply({ content: 'Etwas ist schief gelaufen.' });
        }
    }
}