const { SlashCommandBuilder } = require('@discordjs/builders');
const joinrole = require('../../models/joinrole'); // Pfad anpassen, falls nötig

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setjoinrole')
        .setDescription('Set the role to be given to new members.')
        .addRoleOption(option => 
            option.setName('role')
            .setDescription('The role to assign to new members')
            .setRequired(true)),
    async execute(interaction) {
        const role = interaction.options.getRole('role');

        try {
            await joinrole.findOneAndUpdate(
                { Guild: interaction.guild.id },
                { RoleID: role.id },
                { upsert: true, new: true }
            );

            await interaction.reply(`Join role set to ${role.name}`);
        } catch (error) {
            console.error(`Error setting join role: ${error}`);
            await interaction.reply({ content: 'There was an error setting the join role.', ephemeral: true });
        }
    }
};
