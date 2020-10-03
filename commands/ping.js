const discord = require("discord.js")

module.exports = {
    name: "ping",
    description: "Pong!",
    guildOnly: false,
    aliases: [`p`],
    cooldown: 5,
    args: false
}
module.exports.run = async (bot, message) => {
    let embed = new discord.MessageEmbed()
        .setTitle(":ping_pong:")    //ding dong your religion is wrong
        .setColor("WHITE")          //${Date.now() - message.createdTimestamp}
        .addField("The Ping is:", Date.now() - message.createdTimestamp + "ms")
        .addField("The Discord API ping is:", Math.round(Math.ceil(bot.ws.ping)) + "ms");
    message.channel.send(embed)
}