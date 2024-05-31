const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');
const reactor = require('../../models/reactorSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reactor')
        .setDescription('Manage your reactor system')
        .addSubcommand(command => command.setName('setup').setDescription('Setup your auto reactor system').addStringOption(option => option.setName('emoji').setDescription('The emoji you want to auto react with').setRequired(true)).addChannelOption(option => option.setName('channel').setDescription('The channel you want your auto reactor system to be in').setRequired(false)))
        .addSubcommand(command => command.setName('disable').setDescription('Disable your auto reactor for one channel').addChannelOption(option => option.setName('channel').setDescription('The channel to remove from the auto reactor').setRequired(true)))
        .addSubcommand(command => command.setName('remove-all').setDescription('Remove all of your auto reactor channels in the entire server')),

    async execute(interaction) {
        const { options } = interaction;
        if (!interaction.member.permissions.has(PermissionsBitField.Administrator)) return await interaction.reply({ content: `Only admins can use this command`, ephemeral: true });

        const channel = options.getChannel('channel') || interaction.channel;
        const sub = options.getSubcommand();
        const data = await reactor.findOne({ Guild: interaction.guild.id, Channel: channel.id });

        switch(sub) {
            case 'setup':

            if(data) {
                return await interaction.reply({ content: `You already have this system setup for ${channel}`, ephemeral: true });
            } else {
                const emoji = options.getString('emoji');

                await reactor.create({
                    Guild: interaction.guild.id,
                    Channel: channel.id,
                    Emoji: emoji
                });

                const embed = new EmbedBuilder()
                    .setColor('Blue')
                    .setDescription(`The auto reactor system has been enabled for ${channel}`)

                await interaction.reply({ embeds: [embed], ephemeral: true });
            }

            break;
            case 'disable':

            if(data) {
                return await interaction.reply({ content: `You dont already have this system setup yet for ${channel}`, ephemeral: true });
            } else {
                await reactor.deleteMany({ Guild: interaction.guild.id, Channel: channel.id });

                const embed = new EmbedBuilder()
                    .setColor('Blue')
                    .setDescription(`The auto reactor system has been disabled for ${channel}`)

                await interaction.reply({ embeds: [embed], ephemeral: true });
            }

            break;
            case 'remove-all':

            const removedata = await reactor.findOne({ Guild: interaction.guild.id });
            if (!removedata) {
                return await interaction.reply({ content: `It looks like this system has not already been setup yet in this server`, ephemeral: true });
            } else {
                await reactor.deleteMany({ Guild: interaction.guild.id });

                const embed = new EmbedBuilder()
                    .setColor('Blue')
                    .setDescription(`The auto reactor system has been disabled for the entire server`)

                await interaction.reply({ embeds: [embed], ephemeral: true });
            }
        }
    }
}