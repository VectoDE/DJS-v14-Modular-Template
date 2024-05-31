const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('To warn people in the server')
        .addUserOption((option) => option.setName('user').setDescription('The user to warn').setRequired(true))
        .addStringOption((option) => option.setName('reason').setDescription('The reason for the warning').setRequired(false)),

    async execute(interaction) {
        if(!interaction.member.permissions.has(PermissionsBitField.Administrator)) return await interaction.reply({ content: 'You do not have permissions to run this command.', ephemeral: true });

        const member = interaction.options.getUser('user');
        let reason = interaction.options.getString('reason');

        if(!reason) reason = 'No reason provided';

        const dmSend = new EmbedBuilder()
            .setColor('Red')
            .setTitle(`You got warned in **${interaction.guild}**`)
            .setDescription(`You has been warned in a **${interaction.guild.name}** channel.`)
            .addFields(
                { name: 'Warned by', value: `${interaction.user.tag}` },
                { name: 'Channel', value: `${interaction.channel.name}`},
                { name: 'Reason', value: `${reason}` },
                { name: 'Timestamp', value: `${new Date().toLocaleString()}` }
            )
            .setFooter({ text: '2022-2023 © PlayGS Netzwerk | Alle rechte vorbehalten.' },interaction.user.username, interaction.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

        const embed = new EmbedBuilder()
            .setColor('Red')
            .setTitle(`Warn System`)
            .setDescription(`Successfully warned ${member}.`)
            .addFields(
                { name: 'Warned by', value: `${interaction.user.tag}` },
                { name: 'Channel', value: `${interaction.channel.name}`},
                { name: 'Reason', value: `${reason}` },
                { name: 'Timestamp', value: `${new Date().toLocaleString()}` }
            )
            .setFooter({ text: '2022-2023 © PlayGS Netzwerk | Alle rechte vorbehalten.' },interaction.user.username, interaction.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: true });

        await member.send({ embeds: [dmSend] }).catch(err => {
            return;
        });
    }
};