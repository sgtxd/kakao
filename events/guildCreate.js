module.exports.run = async (bot, discord, db, sdb, guild) => {
    //once the bot joins a guild the database should be prepared for custom settings
    await db.prepare(`INSERT INTO guild_settings (guildID) VALUES (${guild.id})`).run();
    await db.prepare(`INSERT INTO starboard_settings (guildID) VALUES (${guild.id})`).run();
    verbose(`${guild.name} has been added into the database.`)
}