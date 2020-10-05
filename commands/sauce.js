const discord = require("discord.js");
const puppeteer = require("puppeteer");
const fs = require("fs")
const sql = require("better-sqlite3")

module.exports = {
    name: "sauce",
    description: "Finds some sauce.",
    cooldown: 1,
    guildOnly: false,
    args: true,
    usage: "<sauce>"
}
module.exports.run = async (bot, message, args, db, config) => {
    if (!message.channel.nsfw) return message.channel.send("This command can only be used within NSFW channels!")

    if (fs.existsSync("./sauce.db")) {   //Check if the database file exists, if it dosent create a new file and create all tables.
        var db = new sql("./sauce.db");
    } else {
        var db = new sql("./sauce.db");
        db.prepare(`CREATE TABLE "sauce" ("id"	INTEGER UNIQUE,"title"	TEXT,"parodies"	TEXT,"characters"	TEXT,"tags"	TEXT,"artists"	TEXT,"groups"	TEXT,"languages"	TEXT,"categories"	TEXT,"pages"	INTEGER,PRIMARY KEY("id"));`).run();
    }

    if (args == "random") {
        var sauce = Math.floor((Math.random() * 200000) + 100000);
    } else {
        var sauce = args;
    }

    sauceScraper(sauce);

    async function sauceScraper(sauce) {

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(`https://nhentai.net/g/${sauce}/`);

        const [e1] = await page.$x(`/html/body/div[2]/div[1]/div[2]/div/h1`)
        var txt = await e1.getProperty(`textContent`);
        const title = await txt.jsonValue();

        const [e2] = await page.$x(`/html/body/div[2]/div[1]/div[1]/a/img`)
        var src = await e2.getProperty(`src`);
        const image = await src.jsonValue();

        const [e3] = await page.$x(`//html/body/div[2]/div[1]/div[2]/div/section/div[1]/span`)
        var txt = await e3.getProperty(`textContent`);
        const rawParodies = await txt.jsonValue();
        let parodies = rawParodies.replace(/[A-Z0-9]/g, " ").replace(/  +/g, "/").split("/").slice(0, -1).join(", ")
        if (parodies == "") parodies = "No parodies";

        const [e4] = await page.$x(`/html/body/div[2]/div[1]/div[2]/div/section/div[2]/span`)
        var txt = await e4.getProperty(`textContent`);
        const rawCharacters = await txt.jsonValue();
        let characters = rawCharacters.replace(/[A-Z0-9]/g, " ").replace(/  +/g, "/").split("/").slice(0, -1).join(", ")
        if (characters == "") characters = "No characters";

        const [e5] = await page.$x(`/html/body/div[2]/div[1]/div[2]/div/section/div[3]/span`)
        var txt = await e5.getProperty(`textContent`);
        const rawTags = await txt.jsonValue();
        let tags = rawTags.replace(/[A-Z0-9]/g, " ").replace(/  +/g, "/").split("/").slice(0, -1).join(", ")
        if (tags == "") tags = "No tags";

        const [e6] = await page.$x(`/html/body/div[2]/div[1]/div[2]/div/section/div[4]/span`)
        var txt = await e6.getProperty(`textContent`);
        const rawArtists = await txt.jsonValue();
        let artists = rawArtists.replace(/[A-Z0-9]/g, " ").replace(/  +/g, "/").split("/").slice(0, -1).join(", ")
        if (artists == "") artists = "No artists (what?)";

        const [e7] = await page.$x(`/html/body/div[2]/div[1]/div[2]/div/section/div[5]/span`)
        var txt = await e7.getProperty(`textContent`);
        const rawGroups = await txt.jsonValue();
        let groups = rawGroups.replace(/[A-Z0-9]/g, " ").replace(/  +/g, "/").split("/").slice(0, -1).join(", ")
        if (groups == "") groups = "No groups";

        const [e8] = await page.$x(`/html/body/div[2]/div[1]/div[2]/div/section/div[6]/span`)
        var txt = await e8.getProperty(`textContent`);
        const rawlang = await txt.jsonValue();
        let languages = rawlang.replace(/[A-Z0-9]/g, " ").replace(/  +/g, "/").split("/").slice(0, -1).join(", ")
        if (languages == "") languages = "No language? (uhhh)";

        const [e9] = await page.$x(`/html/body/div[2]/div[1]/div[2]/div/section/div[7]/span`)
        var txt = await e9.getProperty(`textContent`);
        const rawCat = await txt.jsonValue();
        let categories = rawCat.replace(/[A-Z0-9]/g, " ").replace(/  +/g, "/").split("/").slice(0, -1).join(", ")
        if (categories == "") categories = "No language? (uhhh)";

        const [e0] = await page.$x(`/html/body/div[2]/div[1]/div[2]/div/section/div[8]/span/a/span`)
        var txt = await e0.getProperty(`textContent`);
        const pages = await txt.jsonValue();
        if (pages == "") pages = "No pages?? (uhhhhhhhhhhhhhhhhh)";

        let embed = new discord.MessageEmbed()
            .setTitle(`The brave science team returned with [${sauce}] (https://nhentai.net/g/${sauce}/)`)
            .setDescription(`**${title}**`)
            .setThumbnail(image)
            .addField(`Parodies:`, parodies)
            .addField(`Characters`, characters)
            .addField(`Tags:`, tags)
            .addField(`Artists:`, artists, true)
            .addField(`Groups:`, groups, true)
            .addField(`Languages:`, languages, true)
            .addField(`Categories:`, categories, true)
            .addField(`Pages:`, pages, true)

        message.channel.send(embed);

        browser.close();

        const config = db.prepare(`SELECT * FROM sauce WHERE id = ?`).get(sauce); //Get guild settings
        if (!config) {
            await db.prepare(`INSERT INTO sauce (id) VALUES (${sauce})`).run();
            var a = title.replace(`'`, `"`);
            await db.prepare(`UPDATE sauce SET title = '${a}' WHERE id = '${sauce}';`).run();
            var a = rawParodies.replace(/[A-Z0-9]/g, " ").replace(/  +/g, "/").split("/").slice(0, -1);
            await db.prepare(`UPDATE sauce SET parodies = '${a}' WHERE id = '${sauce}';`).run();
            var a = rawCharacters.replace(/[A-Z0-9]/g, " ").replace(/  +/g, "/").split("/").slice(0, -1);
            await db.prepare(`UPDATE sauce SET characters = '${a}' WHERE id = '${sauce}';`).run();
            var a = rawTags.replace(/[A-Z0-9]/g, " ").replace(/  +/g, "/").split("/").slice(0, -1);
            await db.prepare(`UPDATE sauce SET tags = '${a}' WHERE id = '${sauce}';`).run();
            var a = rawArtists.replace(/[A-Z0-9]/g, " ").replace(/  +/g, "/").split("/").slice(0, -1)
            await db.prepare(`UPDATE sauce SET artists = '${a}' WHERE id = '${sauce}';`).run();
            var a = rawGroups.replace(/[A-Z0-9]/g, " ").replace(/  +/g, "/").split("/").slice(0, -1)
            await db.prepare(`UPDATE sauce SET groups = '${a}' WHERE id = '${sauce}';`).run();
            var a = rawlang.replace(/[A-Z0-9]/g, " ").replace(/  +/g, "/").split("/").slice(0, -1)
            await db.prepare(`UPDATE sauce SET languages = '${a}' WHERE id = '${sauce}';`).run();
            var a = rawCat.replace(/[A-Z0-9]/g, " ").replace(/  +/g, "/").split("/").slice(0, -1)
            await db.prepare(`UPDATE sauce SET categories = '${a}' WHERE id = '${sauce}';`).run();
            var a = pages
            await db.prepare(`UPDATE sauce SET pages = '${a}' WHERE id = '${sauce}';`).run();
        }
    }
}

//CREATE TABLE "sauce" ("id"	INTEGER UNIQUE,"title"	TEXT,"parodies"	TEXT,"characters"	TEXT,"tags"	TEXT,"artists"	TEXT,"groups"	TEXT,"languages"	TEXT,"categories"	TEXT,"pages"	INTEGER,PRIMARY KEY("id"));
//${sauce},${title},${rawParodies.replace(/[A-Z0-9]/g, " ").replace(/  +/g, "/").split("/").slice(0, -1)}, ${rawCharacters.replace(/[A-Z0-9]/g, " ").replace(/  +/g, "/").split("/").slice(0, -1)}, ${rawTags.replace(/[A-Z0-9]/g, " ").replace(/  +/g, "/").split("/").slice(0, -1)}, ${rawArtists.replace(/[A-Z0-9]/g, " ").replace(/  +/g, "/").split("/").slice(0, -1)}, ${rawGroups.replace(/[A-Z0-9]/g, " ").replace(/  +/g, "/").split("/").slice(0, -1)}, ${rawlang.replace(/[A-Z0-9]/g, " ").replace(/  +/g, "/").split("/").slice(0, -1), rawCat.replace(/[A-Z0-9]/g, " ").replace(/  +/g, "/").split("/").slice(0, -1), pages)