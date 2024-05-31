const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('This gets some server info.'),

    async execute(interaction) {
        const { guild } = interaction;
        const { member } = guild;
        const { name, ownerId, createdTimestamp, memberCount } = guild;
        const icon = guild.iconURL() || 'https://i.postimg.cc/BbzYxb78/logo-transparent.png';
        const roles = guild.roles.cache.size;
        const emojis = guild.emojis.cache.size;
        const id = guild.id;

        let baseVerification = guild.VerificationLevel;

        if (baseVerification == 0) baseVerification = 'None'
        if (baseVerification == 1) baseVerification = 'Low'
        if (baseVerification == 2) baseVerification = 'Medium'
        if (baseVerification == 3) baseVerification = 'High'
        if (baseVerification == 4) baseVerification = 'Very High'

        const embed = new EmbedBuilder()
            .setColor('Blue')
            .setThumbnail(icon)
            .setAuthor({ name: name, iconURL: icon })
            .setFooter({ text: `Server ID: ${id}` })
            .setTimestamp()
            .addFields({ name: 'Name', value: `${name}`, inline: false })
            .addFields({ name: 'Date Created', value: `<t:${parseInt(createdTimestamp / 1000)}:R> (hover for complete date)`, inline: false })
            .addFields({ name: 'Server Owner', value: `<@${ownerId}>`, inline: false })
            .addFields({ name: 'Server Members', value: `${memberCount}`, inline: false })
            .addFields({ name: 'Role Number', value: `${roles}`, inline: false })
            .addFields({ name: 'Emoji Number', value: `${emojis}`, inline: false })
            .addFields({ name: 'Verification Level', value: `${baseVerification}`, inline: false })
            .addFields({ name: 'Server Boosts', value: `${guild.premiumSubscriptionCount}`, inline: false })

        await interaction.reply({ embeds: [embed] });
    }
}