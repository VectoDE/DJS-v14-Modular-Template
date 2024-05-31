const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'serverinfo',
    description: 'This gets some server info.',
    
    async execute(message, args) {
        const { guild } = message;
        const { name, ownerId, createdTimestamp, memberCount } = guild;
        const icon = guild.iconURL() || 'https://i.postimg.cc/BbzYxb78/logo-transparent.png';
        const roles = guild.roles.cache.size;
        const emojis = guild.emojis.cache.size;
        const id = guild.id;
        const boosts = guild.premiumSubscriptionCount;

        let baseVerification = guild.verificationLevel;

        if (baseVerification === 0) baseVerification = 'None';
        if (baseVerification === 1) baseVerification = 'Low';
        if (baseVerification === 2) baseVerification = 'Medium';
        if (baseVerification === 3) baseVerification = 'High';
        if (baseVerification === 4) baseVerification = 'Very High';

        const embed = new EmbedBuilder()
            .setColor('Blue')
            .setThumbnail(icon)
            .setAuthor({ name: name, iconURL: icon })
            .setFooter({ text: `Server ID: ${id}` })
            .setTimestamp()
            .addFields(
                { name: 'Name', value: `${name}`, inline: false },
                { name: 'Date Created', value: `<t:${parseInt(createdTimestamp / 1000)}:R> (hover for complete date)`, inline: false },
                { name: 'Server Owner', value: `<@${ownerId}>`, inline: false },
                { name: 'Server Members', value: `${memberCount}`, inline: false },
                { name: 'Role Number', value: `${roles}`, inline: false },
                { name: 'Emoji Number', value: `${emojis}`, inline: false },
                { name: 'Verification Level', value: `${baseVerification}`, inline: false },
                { name: 'Server Boosts', value: `${boosts}`, inline: false }
            );

        message.channel.send({ embeds: [embed] });
    }
};
