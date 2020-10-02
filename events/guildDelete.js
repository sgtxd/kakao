module.exports.run = async (bot, discord, db, sdb, guild) => {
    //once the bot leaves the guild the custom settings will be nuked
    await db.prepare(`DELETE FROM guild_settings WHERE guild_id='${guild.id}';`).run()
    verbose(`Removed ${guild.name} from the database.`)
}