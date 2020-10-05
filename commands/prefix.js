const discord = require("discord.js");

module.exports = {
    name: "prefix",
    description: "Change the bots prefix",
    guildOnly: true,
    args: true,
    usage: `<new prefix>`
}
module.exports.run = async (bot, message, args, db, config) => {
    if (!message.member.permissions.has(`ADMINISTRATOR`)) return message.channel.send("You need to be an administrator to do that!");
    await db.prepare(`UPDATE guild_settings SET prefix = '${args[0]}' WHERE guildID = '${message.guild.id}'; `).run();
    let embed = new discord.MessageEmbed()
        .setAuthor("Prefix successfully changed")
        .setColor(`WHITE`)
        .setDescription(`Prefix has been changed from ${config.prefix} to ${args[0]}`);
    return message.channel.send(embed);
}