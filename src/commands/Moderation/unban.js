const { PermissionsBitField, EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
       .setName('unban')
       .setDescription('Unban users from the server.')
       .addUserOption(option => option.setName('user').setDescription('The user to unban.').setRequired(true))
       .addStringOption(option => option.setName('reason').setDescription('The reason for unbanning.').setRequired(true)),

    async execute(interaction, client) {
        const userId = interaction.options.getUser('user');
        
        if(!interaction.member.permissions.has(PermissionsBitField.BanMembers)) return await interaction.reply({ content: 'You do not have permissions to unban users.' });

        let reason = interaction.options.getString('reason');

        if(!reason) reason = 'No reason provided.';

        const embed = new EmbedBuilder()
          .setColor('Yellow')
          .setDescription(`Successfully **unbanned** **${userId.tag}** | Reason: ${reason}`)

        await interaction.guild.bans.fetch().then(async bans => {
            if(bans.size == 0) return await interaction.reply({ content: 'There are no banned users in this server.', ephemeral: true});

            let bannedID = bans.find(ban => ban.user.id == userId);
            if(!bannedID) return await interaction.reply({ content: 'This user is not banned in this server' });

            await interaction.guild.bans.remove(userId, reason).catch(err => {
                return interaction.reply({ content: 'I cant unban this user.', ephemeral: true });
            });
        })
    },
};