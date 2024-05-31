const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');
const ticketSchema = require('../../models/ticketSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket-disable')
        .setDescription('Disable the ticket system for the server.'),

    async execute(interaction, client){
        try {
            const GuildID = interaction.guild.id;
            
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) 
                return await interaction.reply({ content: 'You do not have the permissions to use this command.', ephemeral: true });

            const data = await ticketSchema.findOne({ GuildID: GuildID });
            if (!data) 
                return await interaction.reply({ content: 'Ticket system is not enabled.', ephemeral: true });

            await ticketSchema.findOneAndDelete({ GuildID: GuildID });

            const channel = client.channels.cache.get(data.Channel);
            if (channel) {
                await channel.messages.fetch({ limit: 1 }).then(messages => {
                    const lastMessage = messages.first();
                    if (lastMessage.author.id === client.user.id) {
                        lastMessage.delete();
                    }
                });
            }

            const embed = new EmbedBuilder()
                .setColor('Random')
                .setDescription(`Ticket System has been disabled.`)
                .setTimestamp()
                .setAuthor({ name: 'Ticket System' })
                .setFooter({ text: 'Ticket System Disabled' })

            await interaction.reply({ embeds: [embed] });
        } catch (err) {
            console.log(err);
        }
    },
};
