const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('inviteinfo')
        .setDescription('Get info on the invites server.')
        .addStringOption(option => option.setName('invite').setDescription('The invite you want to check.').setRequired(true)),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const { options } = interaction;
        let input = options.getString('invite');

        input.replace('discord.gg/', '');
        input.replace('https://discord.gg/', '');
        input.replace('http://discord.gg/', '');

        let invite;
        try {
            invite = await client.fetchInvite(input, { withCounts: true });
        } catch (e) {
            await interaction.editReply({ content: `I couldn't find an invite matching \`${input}\``});
        }

        if(!invite) return;
        let me = client.guilds.cache.get(invite.guild.id);
        if(!me) me = false;
        else me = true;

        const embed = new EmbedBuilder()
            .setColor('Blurple')
            .setTitle(invite.guild.name)
            .setThumbnail(invite.guild.iconURL())
            .addFields({ name: 'Server Features', value: `> *${invite.guild.features.join('\n> ')}*` })
            .addFields({ name: `Boosts: \`${invite.guild.premiumSubscriptionCount}\``, value: `` })
            .addFields({ name: `Member Count: \`${invite.memberCount}\``, value: ``})
            .addFields({ name: `Server ID: \`${invite.guild.id}\``, value: ``})
            .addFields({ name: `Server Description:`, value: `${invite.guild.description??'none'}` })
            .addFields({ name: `Vanity Invite Code: \`${invite.guild.vanityURLCode??'none'}`, value: ' ' })
            .addFields({ name: `Includes: \`${me}\``, value: `` })
            .setImage(invite.guild.bannerURL({ size: 2048 }))
            .setTimestamp()
            .setFooter({ text: 'Invite Information' })

        await interaction.editReply({ embeds: [embed], ephemeral: true });
    }
}