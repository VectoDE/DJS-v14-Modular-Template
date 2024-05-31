const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Find information about a user in the guild.")
    .setDMPermission(false)
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user you want to get the information of.")
        .setRequired(true)
    ),

  async execute(interaction) {
    try {
      const badges = {
        BugHunterLevel1: "<:bughunter1:1180886880422723624>",
        BugHunterLevel2: "<:bughunter2:1180886862991208529>",
        Partner: "<:discordpartner:1180886843449937930>",
        PremiumEarlySupporter: "<:earlysupporter:1180886815616553121>",
        Staff: "<:discordstaff:1180887418426101770>",
        VerifiedDeveloper: "<:earlyverifieddev:1180886714894536794>",
        ActiveDeveloper: "<:activedeveloper:1180886904519012515>",
      };

      const user = interaction.options.getUser("user") || interaction.user;
      const member = await interaction.guild.members.fetch(user.id);
      const userAvatar = user.displayAvatarURL({ size: 32 });
      const userBadges =
        user.flags
          .toArray()
          .map((badge) => badges[badge])
          .join(" ") || "Keine";
      const nick = member.displayName || "Kein";
      const botStatus = user.bot ? "Yes" : "No";

      const embed = new EmbedBuilder()
        .setTitle(`${user.username}'s Information`)
        .setColor("Red")
        .setThumbnail(userAvatar)
        .setTimestamp()
        .setFooter({ text: `User ID: ${user.id}` })
        .addFields({
          name: "Joined Discord",
          value: `<t:${Math.floor(user.createdAt.getTime() / 1000)}:R>`,
          inline: true,
        })
        .addFields({
          name: "Joined Server",
          value: `<t:${Math.floor(member.joinedAt.getTime() / 1000)}:R>`,
          inline: true,
        })
        .addFields({
          name: "Nickname",
          value: nick,
          inline: false,
        })
        .addFields({
          name: "Boosted Server",
          value: member.premiumSince ? "Yes" : "No",
          inline: false,
        })
        .addFields({
          name: "BOT",
          value: botStatus,
          inline: false,
        })
        .addFields({
          name: "Badges",
          value: userBadges,
          inline: false,
        })
        .addFields({
            name: "Roles",
            value: `${member.roles.cache.map(r => r).join(`` )}`,
            inline: false,
        });

      await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "An error occurred while executeing this command",
        ephemeral: true,
      });
    }
  },
};
