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
    //right now it only creates the database and checks if it exists
    if (fs.existsSync("././databases/users.db")) {
        var db = new sql(path.resolve(__dirname, "../databases/users.db"));
        console.log("Existing user database found, using it!".warn);
    } else {
        console.log("Couldn't find user database, creating one!".verbose);
        var db = new sql(`././databases/users.db`);
        db.prepare('CREATE TABLE "user_settings" (    "userid"	INTEGER UNIQUE,    "banned"	INTEGER DEFAULT 0,    PRIMARY KEY("userid"));').run();
        console.log("Created a new user database!".verbose);
    };
}