const users = require("../models/users");
const { MessageEmbed } = require("discord.js");

module.exports = {
  category: "Goals",
  description: "Modify and/or Add a goal",
  minArgs: 1,
  maxArgs: 1,
  expectedArgs: "<number>",
  slash: "both",
  guildOnly: true,
  testOnly: true,

  callback: async ({ text, user, channel }) => {
    if (
      channel.id === "983764922229981214" ||
      channel.id === "988254263652253696"
    ) {
      try {
        await users.findOneAndUpdate({ discordId: user.id, goal: text });
        const embed = new MessageEmbed()
          .setDescription(
            `Your goal for now is section ${text}. Learn at your own pace!`
          )
          .setTitle(`Hi ${user.username}!`);
        return {
          custom: true,
          embeds: [embed],
          ephemeral: true,
        };
      } catch (error) {
        console.log(error);
      }
    } else {
      return {
        custom: true,
        content: `Please use this command on #goals or #sections`,
      };
    }
  },
};
