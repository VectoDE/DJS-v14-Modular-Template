const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ms = require('ms');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('Stats Slash Command'),

    async execute(interaction, client) {

        const embed = new EmbedBuilder()
            //.setAuthor(interaction.user.username, interaction.user.displayAvatarURL({ dynamic: true }))
            .setTitle('Bot Stats')
            .setDescription('My connections and stats.')
            .addFields(
                { name: 'Ping', value: `${client.ws.ping}ms`, inline: true },
                { name: 'Uptime', value: `${ms(client.uptime)}`, inline: true },
                { name: 'Guilds', value: `${client.guilds.cache.size}`, inline: true },
                { name: 'Users', value: `${client.users.cache.size}`, inline: true },
                { name: 'Channels', value: `${client.channels.cache.size}`, inline: true }
            )
            .setFooter({ text: '2022-2023 © PlayGS Netzwerk | Alle rechte vorbehalten.' }, interaction.user.username, interaction.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};