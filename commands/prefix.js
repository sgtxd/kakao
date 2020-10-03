const sql = require("better-sqlite3")
const discord = require("discord.js")

module.exports = {
    name: "prefix",
    description: "Change the bots prefix",
    guildOnly: true,
    args: true,
    usage: `<prefix>`
}
module.exports.run = async (bot, message, args, db, config) => {
    if (!message.member.permissions.has(`ADMINISTRATOR`)) return message.channel.send("You need to be an administrator to do that!")
    var guild_settings = await db.prepare(`SELECT * FROM guild_settings WHERE guildID = ?;`).get(message.guild.id);
    let oldprefix = guild_settings.prefix
    await db.prepare(`UPDATE guild_settings SET prefix = '${args[0]}' WHERE guildID = '${message.guild.id}'; `).run()
    let embed = new discord.MessageEmbed()
        .setAuthor("Prefix successfully changed")
        .setColor(`WHITE`)
        .setDescription(`Prefix has been changed from ${oldprefix} to ${args[0]}`)
    return message.channel.send(embed)
}