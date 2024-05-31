const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");
const linkSchema = require("../../models/link");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("anti-link")
    .setDescription("Setup anti-link system for your server.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("setup")
        .setDescription("Setup anti-link system for your server.")
        .addStringOption((option) =>
          option
            .setName("permissions")
            .setRequired(true)
            .setDescription(
              "Choose the permissions who bypass the anti link system."
            )
            .addChoices(
              { name: "Manage Channels", value: "Manage Channels" },
              { name: "Manage Server", value: "Manage Server" },
              { name: "Embed Links", value: "Embed Links" },
              { name: "Attach Files", value: "Attach Files" },
              { name: "Manage Message", value: "Manage Message" },
              { name: "Administrator", value: "Administrator" }
            )
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("disable")
        .setDescription("Discable the anti link system.")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("check")
        .setDescription("Check the anti link system status.")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("edit")
        .setDescription("Edit the anti link system permissions.")
        .addStringOption((option) =>
          option
            .setName("permissions")
            .setRequired(true)
            .setDescription(
              "Choose the permissions who bypass the anit link system."
            )
            .addChoices(
              { name: "Manage Channels", value: "Manage Channels" },
              { name: "Manage Server", value: "Manage Server" },
              { name: "Embed Links", value: "Embed Links" },
              { name: "Attach Files", value: "Attach Files" },
              { name: "Manage Message", value: "Manage Message" },
              { name: "Administrator", value: "Administrator" }
            )
        )
    ),

  async execute(interaction, client) {
    const { options } = interaction;

    if (!interaction.member.permissions.has(PermissionsBitField.Administrator))
      return await interaction.reply({
        content: "You do not have Administrator perms to use this command!",
        ephemeral: true,
      });

    const sub = options.getSubcommand();

    switch (sub) {
      case "setup": {
        const permissions = options.getString("permissions");
        const Data = await linkSchema.findOne({ Guild: interaction.guild.id });

        if (Data)
          return await interaction.reply({
            content: "You already have the anti link system setup!",
            ephemeral: true,
          });

        if (!Data) {
          linkSchema.create({
            Guild: interaction.guild.id,
            Perms: permissions,
          });
        }

        const embed = new EmbedBuilder()
          .setColor("Random")
          .setDescription(
            `Successfully setup the anti link system for ${interaction.guild.name} with the permissions: ${permissions}`
          );

        await interaction.reply({ embeds: [embed] });
      }
    }

    switch (sub) {
      case "disable": {
        await linkSchema.deleteMany();

        const embed2 = new EmbedBuilder()
          .setColor("Random")
          .setDescription(
            `<:frecix_tick:86919999999999998> Successfully disabled the anti link system.`
          );

        await interaction.reply({ embeds: [embed2] });
      }
    }

    switch (sub) {
      case "check": {
        const Data = await linkSchema.findOne({ Guild: interaction.guild.id });

        if (!Data)
          return await interaction.reply({
            content: "There is no anti link system setup!",
            ephemeral: true,
          });

        const permissions = Data.Perms;

        if (!permissions)
          return await interaction.reply({
            content: "There is no anti link system permissions!",
            ephemeral: true,
          });
        else
          await interaction.reply({
            content: `The anti link system permissions are: ${permissions}`,
            ephemeral: true,
          });
      }
    }

    switch (sub) {
      case "edit": {
        const Data = await linkSchema.findOne({ Guild: interaction.guild.id });
        const permissions = options.getString("permissions");
        if (!Data)
          return await interaction.reply({
            content: "There is no anti link system setup here!",
            ephemeral: true,
          });
        else {
          await linkSchema.deleteMany();

          await linkSchema.create({
            Guild: interaction.guild.id,
            Perms: permissions,
          });

          const embed3 = new EmbedBuilder()
            .setColor("Random")
            .setDescription(
              `<:frecix_tick:86919999999999998> Your anti link bypass permissions has now been set to ${permissions}`
            );

          await interaction.reply({ embeds: [embed3] });
        }
      }
    }
  },
};
