const { PermissionsBitField, SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban the user from the sevrer.')
        .addUserOption(option => option.setName('user').setDescription('The user to ban.').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('The reason to ban the user.').setRequired(true)),

    async execute(interaction, client) {
        const users = interaction.options.getUser('user');
        const id = users.id;
        const userBan = client.users.cache.get(id);

        if(!interaction.member.permissions.has(PermissionsBitField.BanMembers)) return await interaction.reply({ content: 'You do not have permission to ban members in this server.' });

        if(interaction.member.id === id) return await interaction.reply({ content: 'You cannot ban yourself.' });

        let reason = interaction.options.getString('reason');

        if(!reason) reason = 'No reason provided.';

        const embedDM = new EmbedBuilder()
            .setColor('Yellow')
            .setDescription(`You have been **banned** from **${interaction.guild.name}** | Reason: ${reason}`)


        const embed = new EmbedBuilder()
            .setColor('Red')
            .setDescription(`Successfully **banned** **${userBan.tag}** | Reason: ${reason}`)

        await userBan.send({ embeds: [embedDM] }).catch(err => {
            return;
        });

        await interaction.guild.bans.create(userBan.id, {reason}).catch(err => {
            return interaction.reply({ content: 'I can not ban this user.', ephemeral: true });
        });

        await interaction.reply({ embeds: [embed], ephemeral: true });
     }
};