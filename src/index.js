const { Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField, Permissions, MessageManager, Embed, Collection, Events, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require(`discord.js`);
const fs = require('fs');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers] });
const { createTranscript } = require('discord-html-transcripts');

client.commands = new Collection();
client.prefix = new Map();

require('dotenv').config();

const functions = fs.readdirSync("./src/functions").filter(file => file.endsWith(".js"));
const eventFiles = fs.readdirSync("./src/events").filter(file => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./src/commands");
const prefixFolders = fs.readdirSync("./src/prefix").filter((f) => f.endsWith(".js"));

for (arx of prefixFolders) {
    const Cmd = require('./prefix/' + arx)
    client.prefix.set(Cmd.name, Cmd)
}

// Anti crash system
const process = require('node:process');
const internal = require('stream');
process.on('unhandledRejection', async (reason, promise) => {
    console.log('Unhandled Rejection at:', promise, 'reason:', reason);
});
process.on('uncaughtException', (err) => {
    console.log('Uncaught Exception:', err);
});
process.on('uncaughtExceptionMonitor', (err, origin) => {
    console.log('Uncaught Exception Monitor', err, origin);
});

// Async Bot Login
(async () => {
    for (file of functions) {
        require(`./functions/${file}`)(client);
    }
    client.handleEvents(eventFiles, "./src/events");
    client.handleCommands(commandFolders, "./src/commands");
    client.login(process.env.TOKEN)
})();



//Prefix Commands MessageCreate
client.on('messageCreate', async message => {
    const prefix = "!";

    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    const prefixcmd = client.prefix.get(command);
    if (prefixcmd) {
        prefixcmd.run(client, message, args)
    }
});


//Join Role
const joinrole = require('./models/joinrole');
client.on(Events.GuildMemberAdd, async (member, guild) => {
    const role = await joinrole.findOne({ Guild: member.guild.id });
    if (!role) return;
    const giverole = member.guild.roles.cache.get(role.RoleID);
    member.roles.add(giverole);
})

//Anti link system
const linkSchema = require('./models/link');
client.on(Events.MessageCreate, async message => {
    if (message.content.startsWith('http') || message.content.startsWith('discord.gg') || message.content.includes('discord.gg/') || message.content.includes('https://')) {
        const Data = await linkSchema.findOne({ Guild: message.guild.id });

        if (!Data) return;
        const memberPerms = Data.Perms;
        const user = message.author;
        const member = message.guild.members.cache.get(user.id);
        if (member.permissions.has(memberPerms)) return;
        else {
            (await message.channel.send({ content: `${message.author}, you can't send links here ` })).then(msg => {
                setTimeout(() => msg.delete(), 3000)
            });
            (await message).delete();
        }
    }
})

// Ticket System
const ticketSchema = require('./models/ticketSchema');
client.on(Events.InteractionCreate, async (interaction) => {
    const { customId, guild, channel } = interaction;
    if (interaction.isButton()) {
        const { customId, guild, member, user, channel } = interaction;

        if (customId === 'ticket') {
            let data = await ticketSchema.findOne({ GuildID: guild.id });

            if (!data) return await interaction.reply({ content: 'You have not setup a ticket system.', ephemeral: true });

            const role = guild.roles.cache.get(data.Role);
            const cate = data.Category;
            const posChannel = guild.channels.cache.find(c => c.topic && c.topic.includes(`Ticket Owner: ${user.id}`));

            if (posChannel) {
                return await interaction.reply({ content: `You already have a ticket open: <#${posChannel.id}>`, ephemeral: true });
            }

            await guild.channels.create({
                name: `ticket-${user.username}`,
                parent: cate,
                type: ChannelType.GuildText,
                topic: `Ticket Owner: ${user.username} ||${user.id}||`,
                permissionOverwrites: [
                    {
                        id: guild.id,
                        deny: ['ViewChannel']
                    },
                    {
                        id: role.id,
                        allow: ['ViewChannel', 'ReadMessageHistory'],
                        deny: ['SendMessages']
                    },
                    {
                        id: member.id,
                        allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory']
                    }
                ],
            }).then(async (channel) => {
                const openembed = new EmbedBuilder()
                    .setColor('Random')
                    .setTitle('Ticket Opened')
                    .setDescription(`Welcome to your ticket **${user.username}** \nReact with 🔒 to close the ticket.`)
                    .setThumbnail(guild.iconURL())
                    .setTimestamp()
                    .setFooter({ text: `${guild.name}'s Tickets` });

                const closeButton = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('closeticket')
                            .setLabel('Close')
                            .setStyle(ButtonStyle.Danger)
                            .setEmoji('🔒')
                    );

                const claimButton = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('claimticket')
                            .setLabel('Claim')
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji('🛄')
                    );

                await channel.send({ content: `<@&${role.id}>`, embeds: [openembed], components: [closeButton, claimButton] });
            });
        }

        if (customId === 'closeticket') {
            const closingEmbed = new EmbedBuilder()
                .setDescription('🔒 Are you sure you want to close this ticket?')
                .setColor('Random');

            const buttons = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('yesclose')
                        .setLabel('Yes')
                        .setStyle(ButtonStyle.Danger)
                        .setEmoji('🔐'),
                    new ButtonBuilder()
                        .setCustomId('noclose')
                        .setLabel('No')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('❌')
                );

            await interaction.reply({ embeds: [closingEmbed], components: [buttons] });
        }

        if (customId === 'yesclose') {
            let data = await ticketSchema.findOne({ GuildID: guild.id });
            const transcript = await createTranscript(channel, {
                limit: -1,
                returnBuffer: false,
                filename: `ticket-${user.username}.html`,
            });

            const transcriptEmbed = new EmbedBuilder()
                .setAuthor({ name: `${guild.name}'s Transcripts`, iconURL: guild.iconURL() })
                .addFields(
                    { name: 'Closed By', value: `${user.tag}` }
                )
                .setColor('Random')
                .setTimestamp()
                .setThumbnail(guild.iconURL())
                .setFooter({ text: `${guild.name}'s Tickets` });

            const processEmbed = new EmbedBuilder()
                .setDescription(`Closing ticket in 10 seconds...`)
                .setColor('Random');

            await interaction.reply({ embeds: [processEmbed] });

            await guild.channels.cache.get(data.Logs).send({
                embeds: [transcriptEmbed],
                files: [transcript],
            });

            setTimeout(() => { channel.delete() }, 10000);
        }

        if (customId === 'noclose') {
            const noEmbed = new EmbedBuilder()
                .setDescription('Ticket close cancelled.')
                .setColor('Random');

            await interaction.reply({ embeds: [noEmbed], ephemeral: true });
        }

        if (customId === 'claimticket') {
            const ticketChannel = guild.channels.cache.find(c => c.topic && c.topic.includes(`Ticket Owner: ${user.id}`));
            if (!ticketChannel) {
                return await interaction.reply({ content: 'You do not have any open tickets to claim.', ephemeral: true });
            }

            const teamRole = guild.roles.cache.find(role => role.name === 'Team'); // Beispiel: Teamrolle
            if (!teamRole || !member.permissions.has('MANAGE_CHANNELS')) {
                return await interaction.reply({ content: 'You do not have permission to claim tickets.', ephemeral: true });
            }

            // Check if the ticket has already been claimed
            const existingClaim = ticketChannel.permissionOverwrites.cache.some(overwrite => overwrite.type === 'member' && overwrite.allow.has('SEND_MESSAGES') && overwrite.id !== member.id);

            if (existingClaim) {
                return await interaction.reply({ content: 'This ticket has already been claimed by another team member.', ephemeral: true });
            }

            await ticketChannel.permissionOverwrites.edit(member.id, {
                VIEW_CHANNEL: true,
                SEND_MESSAGES: true,
                READ_MESSAGE_HISTORY: true
            });

            await ticketChannel.permissionOverwrites.edit(role.id, {
                VIEW_CHANNEL: true,
                SEND_MESSAGES: true,
                READ_MESSAGE_HISTORY: true
            });

            const claimButton = new ButtonBuilder()
                .setCustomId('claimticket')
                .setLabel('Claim')
                .setStyle(ButtonStyle.Primary)
                .setEmoji('🛄')
                .setDisabled(true); // Disable the button after claiming

            const components = new ActionRowBuilder().addComponents(claimButton);

            await ticketChannel.send({
                content: `<@${member.id}> has claimed this ticket.`,
                components: [components]
            });

            await interaction.reply({ content: `Ticket successfully claimed. You can now communicate in <#${ticketChannel.id}>.`, ephemeral: true });
        }
    }
});

// bug-report
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isModalSubmit()) return;

    if (interaction.customId === 'bugreport') {
        const command = interaction.fields.getTextInputValue('command');
        const description = interaction.fields.getTextInputValue('description');

        const id = interaction.user.id;
        const member = interaction.member;
        const server = interaction.guild.id || 'No server provided.';
        const username = interaction.guild.name || 'No server provided.';

        const channel = await client.channels.cache.get(process.env.DEV_BUG_REPORT);

        const embed = new EmbedBuilder()
            .setColor('Blurple')
            .setTitle(`Report from ${member}!`)
            .addFields({ name: 'User / ID', value: `${member} ||${id}||` })
            .addFields({ name: 'Server Name / ID', value: `${username} ||${server}||` })
            .addFields({ name: 'Command', value: `${command}` })
            .addFields({ name: 'Description', value: `${description}` })
            .setTimestamp()
            .setFooter({ text: `• Report Bug System • 2022-2023 © PlayGS Netzwerk | Alle rechte vorbehalten.` })

        await channel.send({ embeds: [embed] }).catch(err => { });
        await interaction.reply({ content: `Your report has been submitted.`, ephemeral: true });
    }
});