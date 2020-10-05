const discord = require("discord.js");

module.exports = {
    name: "uptime",
    description: "Shows bot uptime.",
    cooldown: 5,
    guildOnly: false,
    args: false,
}
module.exports.run = async (bot, message, args, db, config) => {
    let totalSeconds = (bot.uptime / 1000);
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = Math.floor(totalSeconds % 60);
    let uptime = `${hours} hours, ${minutes} minutes and ${seconds} seconds`;

    let embed = new discord.MessageEmbed()
        .setTitle(":desktop: Uptime")
        .setColor("WHITE")
        .addField(`${bot.user.username} has been running for:`, uptime);
    return message.channel.send(embed);
}