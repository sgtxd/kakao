//TODO: add consistency in the entire code, pls

const discord = require("discord.js");
const sql = require("better-sqlite3");
const colors = require("colors");
const path = require("path");
const fs = require("fs");
const package = require("./package.json");
const { exit } = require("process");
const bot = new discord.Client();
const sdb = new sql(":memory:");
const puppeteer = require("puppeteer");


browser();

async function browser() {
    browser = await puppeteer.launch({executablePath: 'chromium'});
}

sdb.prepare(`CREATE TABLE "messages" (	"messageID"	INTEGER UNIQUE,	PRIMARY KEY("messageID"));`).run(); //Database temporarily holds messageIDs for the starboard

colors.setTheme({
    warn: `yellow`,
    error: `bgRed`,
    verbose: `cyan`
});

console.log(`version ${package.version}`.green);
console.log(`sgtxd (C) 2020/21`.green);

if (fs.existsSync("./json.db")) {   //Check if the database file exists, if it dosent create a new file and create all tables.
    var db = new sql("./json.db");
} else {
    console.log("Couldn't find database, creating new one!".warn);
    var db = new sql("./json.db");
    db.prepare(`CREATE TABLE "guild_settings" (	"guildID"	INTEGER UNIQUE,	"prefix"	TEXT DEFAULT "*",	"starboard"	INTEGER DEFAULT 0,	"autoTempConv"	INTEGER DEFAULT 0,	PRIMARY KEY("guildID"));`).run();
    db.prepare(`CREATE TABLE "starboard_settings" (	"guildID"	INTEGER UNIQUE,	"emote"	TEXT DEFAULT '⭐',	"emoteAmount"	INTEGER DEFAULT 3,	"channel"	INTEGER,	"waitFor"	INTEGER DEFAULT 5,	PRIMARY KEY("guildID"));`).run();
}

bot.commands = new discord.Collection();    //Load commands and events 
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
    bot.on(eventName, (...args) => eventFunction.run(bot, discord, db, ...args, sdb, browser));
    console.log(`The event: "${eventName}" has been loaded`.verbose);
}
console.log("All commands and events that have been found are loaded!".verbose);

if (fs.existsSync("./config.json")) {
    let config = require("./config.json");
    if(config.login == false) return console.log("Login disabled due to config.".warn);
    if(config.token == "") { console.log("No token specified".error); process.exit(1); }
    try {
        bot.login(config.token);
    } catch (error) {
        console.error(`${error}`.error);
    }
} else {
    console.log("Creating new config.json".warn);
    let configFile = {
        "token": "",
        "login": false
    }

    let data = JSON.stringify(configFile);
    fs.writeFileSync(`./config.json`, data);
    console.log("Make sure the token field on the config.json is populated with the bot's token and login is set to true!".error);
    process.exit(1);
};