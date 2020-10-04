module.exports.run = async (bot, discord, db, sdb, guild) => {
    //once the bot leaves the guild the custom settings will be nuked
    await db.prepare(`DELETE FROM guild_settings WHERE guildID='${guild.id}';`).run();
    await db.prepare(`DELETE FROM starboard_settings WHERE guildID='${guild.id}';`).run();
    console.log(`Removed ${guild.name} from the database.`.verbose);
}