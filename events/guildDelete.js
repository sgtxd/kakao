module.exports.run = async (bot, discord, db, guild, sdb) => {
    //once the bot leaves the guild the custom settings will be nuked
    let guildSettings = await db.prepare('SELECT * FROM guild_settings WHERE guildID = ?').get(guild.id); //Check if the guild is already in the database
    if (!guildSettings) return console.log(`${guild.name} already dosen't exist anymore in the database`.verbose);

    await db.prepare('DELETE FROM guild_settings WHERE guildID= ? ').run(guild.id);
    await db.prepare('DELETE FROM starboard_settings WHERE guildID= ? ').run(guild.id);
    return console.log(`Removed ${guild.name} from the database.`.verbose);
}