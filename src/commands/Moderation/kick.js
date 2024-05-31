const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('To kick people from the server')
        .addUserOption((option) => option.setName('user').setDescription('The user to kick').setRequired(true))
        .addStringOption((option) => option.setName('reason').setDescription('The reason for the kick').setRequired(false)),

    async execute(interaction) {
        const userKick = interaction.options.getUser('user');
        const memberKick = await interaction.guild.members.fetch(userKick.id);

        if(!interaction.member.permissions.has(PermissionsBitField.KickMembers)) return await interaction.reply({ content: 'You do not have permissions' });

        if(!memberKick) return await interaction.reply({ content: 'User not found', ephemeral: true });

        if(!memberKick.kickable) return await interaction.reply({ content: 'I cannot kick this user', ephemeral: true });

        let reason = interaction.options.getString('reason');

        if(!reason) reason = 'No reason provided.';

        const embedDM = new EmbedBuilder()
            .setColor('Orange')
            .setTitle(`You been kicked`)
            .setDescription(`You have been **kicked** from ${interaction.guild} | Reason: ${reason}`)
            .setFooter('2022-2023 © PlayGS Netzwerk | Alle rechte vorbehalten.' ,interaction.user.username, interaction.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

        const embed = new EmbedBuilder()
           .setColor('Purple')
           .setTitle(`Kicked Member`)
           .setDescription(`Successfully kicked ${userKick.tag} from the server. | Reason: ${reason}`)
           .setFooter('2022-2023 © PlayGS Netzwerk | Alle rechte vorbehalten.',interaction.user.username, interaction.user.displayAvatarURL({ dynamic: true }))
           .setTimestamp();

        await memberKick.send({ embeds: [embedDM] }).catch(err => {
            return;
        });

        await memberKick.kick({ reason: reason }).catch(err => {
            interaction.reply({ content: 'error', ephemeral: true });
        });

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};