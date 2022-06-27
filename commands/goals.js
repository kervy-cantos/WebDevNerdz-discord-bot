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

  callback: async ({ text, user, channel, interaction }) => {
    const yourId = { discordId: user.id };
    let update = { goal: text };
    if (channel.id === "988254819405930536") {
      try {
        const yourGoal = await users.findOneAndUpdate(yourId, update, {
          new: true,
        });
        let section = yourGoal.section;
        console.log(yourGoal);
        console.log(text);
        console.log(section);
        let description = `Your goal for now is section ${text}. Learn at your own pace!\n\n`;
        if (text === 0) {
          description += `*You haven't specified a goal yet. You might wanna use /goals to add one*`;
        } else if (text > section) {
          let goalDistance = text - section;
          description += `*You are ${goalDistance.toString()} sections away from your goal. Keep it up!*`;
        } else if (text <= section && text !== 0) {
          description += `***Congratulations!!  You have reached your goal !!. Use /goals to add a new goal***`;

          try {
            await users.findOneAndUpdate(yourId, { goal: 0 });
            console.log("reset");
          } catch (error) {
            console.log(error);
          }
        }
        const embed = new MessageEmbed()
          .setDescription(description)
          .setTitle(`Hi ${user.username}!`)
          .setThumbnail(interaction.user.displayAvatarURL())
          .setColor(0xf7d716);
        return {
          custom: true,
          embeds: [embed],
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
