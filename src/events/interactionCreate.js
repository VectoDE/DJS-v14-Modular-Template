const { PermissionsBitField } = require('discord.js');
const axios = require('axios');
const modroleSchema = require('../Schemas/modroleSchema');
const blockcmdSchema = require('../Schemas/blockcmdSchema');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);

        //Return Command
        if (!command) return

        //owner command
        if(command.owner == true){
            if(interaction.user.id !== process.env.DEV_ID) return await interaction.reply({ content: `You cant use this command.` });
        }

        //premium filter
        if(command.premium == true){
            const response = await axios.get(`https://discord.com/api/v10/applications/${process.env.CLIENT_ID}/entitlements`, {
                headers: {
                    'Authorization': `Bot ${process.env.TOKEN}`,
                }
            });
            var server;
            await response.data.forEach(async data => {
                let guildId = data.guild_id;
                if(guildId == interaction.guild.id){
                    server = 'premium';
                }
            });
            if(server != 'premium'){
                const url = `https://discord.com/api/v10/interactions/${interaction.id}/${interaction.token}/callback`;
                const json = {
                    type: 10,
                    data: {},
                };
                return await fetch(url, {
                    method: 'POST',
                    body: JSON.stringify(json),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            }
        }

        //Administrator command
        if(command.admin == true){
            if(interaction.user.id !== PermissionsBitField.Flags.Administrator) return await interaction.reply({ content: `You cant use this command.` });
        }

        //mod role system
        if(command.mod){
            var modRoleData = await modroleSchema.find({ Guild: interaction.guild.id });
            if(modRoleData.length > 0){
                var check;
                await modRoleData.forEach(async value => {
                    const mRoles = await interaction.member.roles.cache.map(role => role.id);
                    await mRoles.forEach(async role => {
                        if(role == value.Role) check = true;
                    });
                });

                if(!check) return await interaction.reply({ content: `⚠ Only **moderator** can use this command!` });
            }
        }

        //blacklist users system
        const blacklistusersSchema = require('../Schemas/blacklistusersSchema');
        const blacklistusers = await blacklistusersSchema.findOne({ User: interaction.user.id });
        if(blacklistusers) return await interaction.reply({ content: `You have been **blacklisted** from using this bot! This means the developer doesn't want you to use its commands for any given reason.` });
        
        //block cmd
        var blockcmd = await blockcmdSchema.find({ Guild: interaction.guild.id });
        var match = [];
        await blockcmd.forEach(async value => {
            if(value.Command == interaction.commandName) return match.push(value);
        });
        if(match.length > 0){
            return await interaction.reply({ content: `⚠ Sorry! Looks like this server has this command **blocked from use!**` });
        }
        
        try{
            await command.execute(interaction, client);
        } catch (error) {
            console.log(error);
            await interaction.reply({
                content: 'There was an error while executing this command!', 
                ephemeral: true
            });
        } 

    },
};