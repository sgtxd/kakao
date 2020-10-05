module.exports.run = async (bot, discord, db, guild, sdb) => {

    let guildSettings = await db.prepare('SELECT * FROM guild_settings WHERE guildID = ?').get(guild.id); //Check if the guild is already in the database
    if (guildSettings) return console.log(`${guild.name} already exists in the database`.verbose);

    await db.prepare('INSERT INTO guild_settings (guildID) VALUES (?)').run(guild.id);    //Add the guild into both tables of the database
    await db.prepare('INSERT INTO starboard_settings (guildID) VALUES (?)').run(guild.id);
    return console.log(`${guild.name} has been added into the database.`.verbose);
}