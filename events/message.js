//TODO: run commands over dms
const discord = require("discord.js");
const cooldowns = new discord.Collection();

module.exports.run = async (bot, discord, db, message, sdb, browser) => {
    if (message.author.bot || message.channel.type !== 'text') return;

    const config = db.prepare('SELECT * FROM guild_settings WHERE guildID = ?').get(message.guild.id); //Get guild settings
    if (!config) { return await db.prepare('INSERT INTO guild_settings (guildID) VALUES (?)').run(message.guild.id); }

    async function commandHandler(message, config) {
        if (!message.content.startsWith(config.prefix)) return;
        let content = message.content.slice(config.prefix.length).split(' ');
        let cmdname = content[0];
        let args = content.slice(1);
        const command = bot.commands.get(cmdname) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmdname));
        if (!command) return;

        if (command.args && !args.length) {
            let embed = new discord.MessageEmbed()
                .setColor("WHITE")
                .setAuthor("You haven't specified any of the required arguments!")
                .setDescription(`The proper usage is: "${config.prefix}${cmdname} ${command.usage}"`);
            return message.channel.send(embed);
        }

        if (!cooldowns.has(command.name)) { //Cooldown check
            cooldowns.set(command.name, new discord.Collection());
        }

        const now = Date.now();
        const timestamps = cooldowns.get(command.name);
        const cooldownAmount = (command.cooldown || 3) * 1000;

        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                let embed = new discord.MessageEmbed()
                    .setAuthor("Woah, hold on there!")
                    .setDescription(`Please Wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
                return message.channel.send(embed);
            }
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

        try {
            command.run(bot, message, args, db, config, browser);
        } catch (error) {
            console.log(`${error}`.error);
            return message.channel.send('Something happened');
        }
    }

    async function optionalFunctions(message, config) {
        if (config.autoTempConv == 1) {     //Automatic temperature conversion in the chat
            let messageSplit = message.content.split(" ");

            if (message.content.includes("°C")) {
                for (x = 0; x < messageSplit.length; x++) {
                    if (messageSplit[x].includes("°C")) tempInfo = messageSplit[x].slice(0, -2);
                }
                console.log(tempInfo)
                if(tempInfo == "" || isNaN(tempInfo)) return;
                let temperature = Math.round(((tempInfo * 1.8) + 32) * 100) / 100;
                message.channel.send(`${tempInfo} Celsius equals ${temperature} Fahrenheit`);
            }

            if (message.content.includes("°F")) {
                for (x = 0; x < messageSplit.length; x++) {
                    if (messageSplit[x].includes("°F")) tempInfo = messageSplit[x].slice(0, -2);
                }
                if(tempInfo == "" || isNaN(tempInfo)) return;
                let temperature = Math.round(((tempInfo - 32) / 1.8) * 100) / 100;
                message.channel.send(`${tempInfo} Fahrenheit equals ${temperature} Celsius`);
            }
        }


        if (config.starboard == 1) {    //if starboard enabled check how long message will be logged and add it into the memory database
            let starboardConfig = db.prepare('SELECT * FROM starboard_settings WHERE guildID = ?').get(message.guild.id);
            if(!starboardConfig) {return await db.prepare('INSERT INTO starboard_settings (guildID) VALUES (?)').run(message.guild.id);}
            let waitFor = starboardConfig.waitFor * 60000;
            sdb.prepare('INSERT INTO messages (messageID) VALUES (?)').run(message.id);

            async function deleter(message) {
                sdb.prepare('DELETE FROM messages WHERE messageID= ?').run(message.id);
            }

            setTimeout(function () { deleter(message) }, waitFor);
        }
    }

    if (message.content == `<@!${bot.user.id}>`) {
        let embed = new discord.MessageEmbed()
            .setColor(`WHITE`)
            .setAuthor(`My prefix here is "${config.prefix}"`);
        return message.channel.send(embed);
    }

    commandHandler(message, config);
    optionalFunctions(message, config);
}