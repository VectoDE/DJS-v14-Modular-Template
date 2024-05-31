const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('wish')
        .setDescription('Create a wish.')
        .addStringOption(option => option
            .setName('name')
            .setDescription('Setze den Oberbegriff deines Wunsches.')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('beschreibung')
            .setDescription('Beschreibe deinen Wunsch.')
            .setRequired(true)
        ),

    async execute(interaction) {
        const { guild, options, member, user } = interaction;

        const name = options.getString('name');
        const description = options.getString('beschreibung');

        const embed = new EmbedBuilder()
            .setColor('Random')
            .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL({ dynamic: true }) })
            .addFields(
                { name: 'Wunsch', value: `${name}` },
                { name: 'Description', value: `${description}` },
            )
            .setFooter({ text: 'Ulix | ulixserver.de © 2023 | Alle rechte vorbehalten.' });

        await guild.channels.cache.get(process.env.WISHES_CHANNEL).send({ //wünsche channel id
            embeds: ([embed]),
        }).then((s) => {
            s.react('✅');
            s.react('❌');
        }).catch((err) => {
            throw err;
        });

        interaction.reply({ content: '✅ | Dein Wunsch wurde gepostet! Warte die Abstimmung ab.', ephemeral: true });
    }
}