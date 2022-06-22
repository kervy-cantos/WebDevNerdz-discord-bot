const mongoose = require("mongoose");
const users = require("../models/users");
const { MessageEmbed } = require("discord.js");

module.exports = {
  description: `Saves and Displays a user's current section in the course`,
  category: "Section",
  slash: "both",
  testOnly: true,
  guildOnly: true,

  options: [
    {
      type: "SUB_COMMAND",
      name: "save",
      description: "Save a user's progress(Only accepts numbers)",
      options: [
        {
          name: "section_num",
          type: "NUMBER",
          description: "Your current section",
          required: true,
        },
      ],
    },
    {
      type: "SUB_COMMAND",
      name: "show",
      description: "Shows your section progress in the course",
    },
    {
      type: "SUB_COMMAND",
      name: "showall",
      description: "Shows everyone's progress",
    },
  ],

  error: ({ error, message }) => {
    console.log(error);
  },
  callback: async ({ interaction, channel, user }) => {
    const subCommand = interaction.options.getSubcommand();
    const sectionNum = interaction.options.getNumber("section_num");
    const userid = user.id;
    const memberName = interaction.user.username;
    const avatar = interaction.user;
    if (channel.id != "983764922229981214") {
      return {
        custom: true,
        content: "Please use this command on #sections",
      };
    } else {
      if (subCommand === "save") {
        const search = await users.findOne({ discordId: userid });
        if (!search) {
          try {
            await users.create({
              discordId: userid,
              section: sectionNum,
              discordName: memberName,
              lastUpdate: Date.now(),
            });
          } catch (error) {
            console.log(error);
          }
        } else {
          const filterId = { discordId: user.id };
          const update = {
            section: sectionNum,
            discordName: memberName,
            lastUpdate: Date.now(),
          };
          try {
            await users.findOneAndUpdate(filterId, update, {
              new: true,
            });
          } catch (error) {
            console.log(error);
          }
        }
        let currentTime = new Date();
        currentTime = currentTime.toString();
        const embed = new MessageEmbed()
          .setTitle(`**Way to go!  ${memberName}**`)
          .setDescription(`***You are currently at section ${sectionNum}***`)
          .setColor(0xba55d3)
          .setThumbnail(avatar.displayAvatarURL())

          .setFooter({
            text: `***Last Updated***: ${currentTime}`,
          });
        return embed;
      } else if (subCommand === "show") {
        const progress = await users.findOne({ discordId: userid });
        if (!progress) {
          return {
            custom: true,
            content: `You haven't saved your progress yet. Please use /sections save.`,
          };
        } else {
          const { section, lastUpdate } = progress;
          let timeString = lastUpdate.toString();
          try {
            const embed = new MessageEmbed()
              .setTitle(`Your Current Section: **${section}**`)
              .setColor(0xba55d3)
              .setThumbnail(avatar.displayAvatarURL())

              .setFooter({
                text: "***Last Updated***: " + timeString,
              });
            return embed;
          } catch (error) {
            return {
              custom: true,
              content: `Sorry Something went wrong`,
            };
          }
        }
      } else if (subCommand === "showall") {
        let progress = await users.find().sort({ section: "asc", test: -1 });
        let description = `Everyone's Current Progress\n\n`;
        for (const prog of progress) {
          let timeString = prog.lastUpdate.toTimeString().slice(0, 18);
          description += `**Name:** **${prog.discordName}**\n`;
          description += `**Section:** ${prog.section}\n`;
          description += `**Last Update:** ${timeString}\n\n`;
        }
        const embed = new MessageEmbed()
          .setDescription(description)
          .setColor(0xba55d3);

        return embed;
      }
    }
  },
};
