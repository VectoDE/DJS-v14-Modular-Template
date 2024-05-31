const { Events } = require('discord.js');
const joinrole = require('../models/joinrole'); // Pfad anpassen, falls nötig

module.exports = {
    name: 'guildMemberAdd',
    async execute(member) {
        try {
            const roleData = await joinrole.findOne({ Guild: member.guild.id });
            if (!roleData) return;

            const role = member.guild.roles.cache.get(roleData.RoleID);
            if (!role) {
                console.log(`Role ID ${roleData.RoleID} not found in guild ${member.guild.id}`);
                return;
            }

            await member.roles.add(role);
            console.log(`Assigned role ${role.name} to new member ${member.user.tag}`);
        } catch (error) {
            console.error(`Error assigning role to new member: ${error}`);
        }
    },
};