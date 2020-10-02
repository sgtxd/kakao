const discord = require("discord.js");
const sql = require("better-sqlite3");
const colors = require("colors");
const path = require("path");
const fs = require("fs");
const config = require("./config.json");
const package = require("./package.json");
const bot = new discord.Client();

colors.setTheme({
    warn: `yellow`,
    error: `bgRed`,
    verbose: `cyan`
});

console.log(`                         __ \n                        |  \\\n  _______ __    __  ____| ▓▓\n /       \\  \\  /  \\/      ▓▓\n|  ▓▓▓▓▓▓▓\\▓▓\\/  ▓▓  ▓▓▓▓▓▓▓\n \\▓▓    \\  >▓▓  ▓▓| ▓▓  | ▓▓\n _\\▓▓▓▓▓▓\\/  ▓▓▓▓\\| ▓▓__| ▓▓\n|       ▓▓  ▓▓ \\▓▓\\\\▓▓    ▓▓\n \\▓▓▓▓▓▓▓ \\▓▓   \\▓▓ \\▓▓▓▓▓▓▓`.green)
console.log(`version ${package.version}`.green)
console.log(`sgtxd (C) 2020/21`.green)

//TODO: You see this cancer of checking for one folder and two files? clean it up

if(fs.existsSync("./databases")) {
    console.log("Database folder exists.".verbose)
} else {
    fs.mkdir("./databases", (err) => {
        if(err) throw err;
    })
}

//Check if the database exists, if it dosent create it,
if (fs.existsSync("./databases/guilds.db")) {
    var db = new sql(path.resolve(__dirname, "./databases/guilds.db"));
    console.log("Existing guild database found, using it!".verbose);
} else {
    console.log("Couldn't find guild database, creating one!".warn);
    var db = new sql(`./databases/guilds.db`);
    db.prepare('CREATE TABLE "guild_settings" (	"guild_id"	INTEGER DEFAULT 0 UNIQUE,	"prefix"	TEXT DEFAULT "*",	"starboard"	INTEGER DEFAULT 0,   "autoTempConv"	INTEGER DEFAULT 0,  PRIMARY KEY("guild_id"));').run();
    console.log("Created a new guild database!".verbose);
};

if (fs.existsSync("./databases/starboard.db")) {
    var sdb = new sql(path.resolve(__dirname, "./databases/starboard.db"));
    console.log("Existing starboard database found, using it!".verbose);
} else {
    console.log("Couldn't find starboard database, creating one!".warn);
    var sdb = new sql(`./databases/starboard.db`);
    sdb.prepare('CREATE TABLE "guild_settings" (	"guild_id"	INTEGER DEFAULT 0 UNIQUE,	"emote"	TEXT DEFAULT ⭐,	"amount"	INTEGER DEFAULT 3,	"channel"	INTEGER,	"waitFor"	INTEGER DEFAULT 5,	PRIMARY KEY("guild_id"));').run();
    sdb.prepare('CREATE TABLE "messages" (	"id"	INTEGER,	"waitfor"	INTEGER,    PRIMARY KEY("id"));').run();
    console.log("Created a new starboard database!".verbose);
};
//The command and event loader
bot.commands = new discord.Collection();
const jsfile = fs.readdirSync(`./commands/`).filter(file => file.endsWith(`js`));
for (const file of jsfile) {
    let command = require(`./commands/${file}`);
    bot.commands.set(command.name, command);
    console.log(`${file} has been loaded`.verbose);
}

const evfile = fs.readdirSync(`./events/`).filter(file => file.endsWith(`js`));
for (const file of evfile) {
    let eventFunction = require(`./events/${file}`);
    if (!eventFunction) return;
    let eventName = file.split(".")[0];
    bot.on(eventName, (...args) => eventFunction.run(bot, discord, db, sdb, ...args));
    console.log(`The event: "${eventName}" has been loaded`.verbose);
}
console.log("All commands that have been found are loaded!".verbose);

if (config.token) {
    if(config.login == false) return console.log("Login disabled due to config.".warn);
    try {
        bot.login(config.token);
        console.log("im logged in retard".verbose);
    } catch (error) {
        console.error(`${error}`.error);
    }   
} else throw new Error("No token found!".error);