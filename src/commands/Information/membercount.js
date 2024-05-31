const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('membercount')
        .setDescription('Show number of members in the server.'),

    async execute(interaction, client) {
        const embed = new EmbedBuilder()
            .setColor('Random')
            .setTitle(`${interaction.guild.name}`)
            .addFields([
                {
                    name: 'Total Members',
                    value: `${interaction.guild.memberCount}`,
                    inline: true
                },
                {
                    name: 'Users',
                    value: `${interaction.guild.members.cache.filter(m =>!m.user.bot).size}`,
                    inline: true
                },
                {
                    name: 'Bots',
                    value: `${interaction.guild.members.cache.filter(m => m.user.bot).size}`,
                    inline: true
                },
                {
                    name: 'Roles',
                    value: `${interaction.guild.roles.cache.size}`,
                    inline: true
                },
                {
                    name: 'Emojis',
                    value: `${interaction.guild.emojis.cache.size}`,
                    inline: true
                },
                {
                    name: 'Channels',
                    value: `${interaction.guild.channels.cache.size}`,
                    inline: true
                },
           ])
           .setThumbnail(client.user.displayAvatarURL())
           .setFooter({ text: '2022-2023 © PlayGS Netzwerk | Alle rechte vorbehalten.' },interaction.user.username, interaction.user.displayAvatarURL({ dynamic: true }))

           await interaction.reply({ embeds: [embed] });
    }
};