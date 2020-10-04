//TODO: Search the channel by ID, database has a channel entry which is currently unused.
//  if no ID present search for a channel called starboard and use that instead, ofc write channel into the database
module.exports.run = async (bot, discord, db, MessageReaction, user, sdb) => {
    const config = db.prepare(`SELECT * FROM guild_settings WHERE guildID = ?`).get(MessageReaction.message.guild.id);
    const starboardConfig = db.prepare(`SELECT * FROM starboard_settings WHERE guildID = ?`).get(MessageReaction.message.guild.id);
    const msg = sdb.prepare(`SELECT * FROM messages WHERE messageID = ?`).get(MessageReaction.message.id);
    if (!msg || config.starboard == 0) return;
    //Incompatible with many other emotes due to API weirdness
    if (MessageReaction.emoji.name !== starboardConfig.emote) return;

    let starboardChannel = MessageReaction.message.guild.channels.cache.find(starboard => starboard.name === 'starboard');

    if (MessageReaction.message.author.id == user.id) {
        MessageReaction.message.channel.send(`Hey ${user}, you can't star your own message! \nThis results in the message being disqualified from the starboard.`);
        return await sdb.prepare(`DELETE FROM messages WHERE messageID='${MessageReaction.message.id}';`).run();
    }

    if (!starboardChannel) {
        db.prepare(`UPDATE guild_settings SET starboard = ? WHERE guildID = ?`).run(0, MessageReaction.message.guild.id);
        return MessageReaction.message.channel.send("Couldn't find starboard channel");
    } else {
        if (MessageReaction.count >= starboardConfig.emoteAmount) {
            await sdb.prepare(`DELETE FROM messages WHERE messageID='${MessageReaction.message.id}';`).run();
            starboardChannel.send(MessageReaction.message.content);
        }
    }

}