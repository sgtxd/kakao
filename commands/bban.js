const fs = require("fs");
const path = require("path");
const discord = require("discord.js")
const sql = require("better-sqlite3");

module.exports = {
    name: "bban",
    description: "Bans user from ever using the bot until unbanned by the owner.",
    guildOnly: false,
    args: true,
    usage: "<userid>"
}
module.exports.run = async (bot, message) => {
    //later
}