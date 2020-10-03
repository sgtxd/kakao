const discord = require("discord.js");

module.exports = {
  name: "eval",
  description: "Bot owner only command.",
  guildOnly: false,
  args: true,
  usage: "<arguments>"
}

module.exports.run = async (bot, message, args, db, config) => {
  if (message.author.id !== "301359457021984769") return;

  function clean(text) {
    if (typeof (text) === "string")
      return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
      return text;
  }
  try {
    var code = args.join(" ");
    var evaled = eval(code);

    if (typeof evaled !== "string")
      evaled = require("util").inspect(evaled);

    let botembed = new discord.MessageEmbed()
      .setColor("#00cd00")
      .addField("Result:", ("xl", clean(evaled)))
    return message.channel.send(botembed);
  } catch (err) {
    let botembed = new discord.MessageEmbed()
      .setColor("#FF0000")
      .addField("Error:", (`\n${clean(err)}`))
    return message.channel.send(botembed);
  }
}