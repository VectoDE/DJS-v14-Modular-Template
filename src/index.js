const {
    Client,
    GatewayIntentBits,
    EmbedBuilder,
    PermissionsBitField,
    Permissions,
    MessageManager,
    Embed,
    Collection,
    Events,
    ChannelType,
    MessageType,
    Partials,
    NewsChannel,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    TextInputStyle,
    ReactionUserManager,
} = require(`discord.js`);
const fs = require("fs");
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildPresences,
    ],
    partials: [
        Partials.Message,
        Partials.GuildMessageReactions,
        Partials.Channel,
        Partials.MessageReactionAdd,
        Partials.MessageReactionRemove,
        Partials.Reaction,
        Partials.VoiceStateUpdate,
        Partials.GuildVoice,
    ],
});

client.commands = new Collection();
client.prefix = new Map();

require("dotenv").config();

const functions = fs
    .readdirSync("./src/functions")
    .filter((file) => file.endsWith(".js"));
const eventFiles = fs
    .readdirSync("./src/events")
    .filter((file) => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./src/commands");
const prefixFolders = fs
    .readdirSync("./src/prefix")
    .filter((f) => f.endsWith(".js"));

for (arx of prefixFolders) {
    const Cmd = require("./prefix/" + arx);
    client.prefix.set(Cmd.name, Cmd);
}

// Moderation Logging System & Anti crash system
const process = require("node:process");
const internal = require("stream");

process.on("unhandledRejection", async (reason, promise) => {
    console.log("Unhandled Rejection at:", promise, "reason:", reason);
});
process.on("uncaughtException", (err) => {
    console.log("Uncaught Exception:", err);
});
process.on("uncaughtExceptionMonitor", (err, origin) => {
    console.log("Uncaught Exception Monitor", err, origin);
});

// Async Bot Login
(async () => {
    for (file of functions) {
        require(`./functions/${file}`)(client);
    }
    client.handleEvents(eventFiles, "./src/events");
    client.handleCommands(commandFolders, "./src/commands");
    client.login(process.env.BOT_TOKEN);
})();

//Join Role
//const joinrole = require('./Schemas.js/joinrole');
//client.on(Events.GuildMemberAdd, async (member, guild) => {

//    const role = await joinrole.findOne({ Guild: member.guild.id });
//    if (!role) return;
//    const giverole = member.guild.roles.cache.get(role.RoleID);
//    member.roles.add(giverole);
//})

//prefix command handler
client.on(Events.MessageCreate, async (message) => {
    const prefix = process.env.BOT_PREFIX;

    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    const prefixcmd = client.prefix.get(command);
    if (prefixcmd) {
        prefixcmd.run(client, message, args);
    }
});