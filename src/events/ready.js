const { Client, ActivityType } = require('discord.js');
const mongoose = require('mongoose');
const mongodbURL = process.env.MONGODBURL;

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`Bot: ${client.user.username} is online!`);

        if (!mongodbURL) return;

        await mongoose.connect(mongodbURL || "", {})

        if (mongoose.connect) {
            console.log("Bot: MongoDB Connected!")
        }

        //YouTube Notification
        setInterval(client.youtubeCheck, 7000);

        const activity = [
            { name: `${client.guilds.cache.size} server's`, type: ActivityType.Listening, status: 'online' },
            { name: `LIVE on TWITCH`, type: ActivityType.Streaming, url: 'https://www.twitch.tv/vectode' },
            { name: 'development', type: ActivityType.Competing, status: 'idle' },
            { name: 'Vecto. Community', type: ActivityType.Watching, status: 'dnd' }
        ]

        setInterval(() => {
            const botStatus = activity[Math.floor(Math.random() * activity.length)];
            client.user.setPresence({ activities: [{ name: `${botStatus.name}`, type: botStatus.type, url: botStatus.url }], status: botStatus.status });
        }, 5000)

        async function pickPresence () {
            const option = Math.floor(Math.random() * statusArray.length);

            try {
                await client.user.setPresence({
                    activities: [
                        {
                            name: statusArray[option].content,
                            type: statusArray[option].type,
                        },
                    ],
                    status: statusArray[option].status
                })
            } catch (error) {
                console.error(error);
            }
        }
    },
};