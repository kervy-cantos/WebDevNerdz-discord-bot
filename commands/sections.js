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
      maxArgs: 1,
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
      maxArgs: 0,
    },
    {
      type: "SUB_COMMAND",
      name: "showall",
      description: "Shows everyone's progress",
      maxArgs: 0,
    },
  ],

  error: ({ error, message }) => {
    console.log(error);
  },
  callback: async ({ interaction, channel, user, guild }) => {
    const subCommand = interaction.options.getSubcommand();
    const sectionNum = interaction.options.getNumber("section_num");
    const userid = user.id;
    const memberName = interaction.user.username;
    const avatar = interaction.user;
    const member = await guild.members.fetch(userid);
    if (
      channel.id === "983764922229981214" ||
      channel.id === "990940079923023905"
    ) {
      if (subCommand === "save") {
        const search = await users.findOne({ discordId: userid });
        if (!search || search.length === 0) {
          try {
            await users.create({
              discordId: userid,
              section: sectionNum,
              discordName: memberName,
              lastUpdate: Date.now(),
              goal: 60,
            });
            console.log("created");
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
            console.log("updated");
          } catch (error) {
            console.log(error);
          }
        }
        const sectionUpdate = await users.findOne({ discordId: user.id });
        let sectionRole = sectionUpdate.section;
        let newRole, newRole2, newRole3;
        goal = sectionUpdate.goal;
        let currentTime = new Date();
        if (member.manageable) {
          if (sectionRole <= 13) {
            member.roles.add("983079086589112372");
            member.roles.remove("983079178947686420");
            member.roles.remove("988253318734307328");
          } else if (sectionRole > 13 && sectionRole <= 38) {
            member.roles.add("983079178947686420");
            member.roles.remove("983079086589112372");
            member.roles.remove("988253318734307328");
          } else {
            member.roles.add("988253318734307328");
            member.roles.remove("983079086589112372");
            member.roles.remove("983079178947686420");
          }

          let timeZ = member.nickname.split("|").pop();

         await member.setNickname(
            `${memberName} | Section ${sectionNum} | ${timeZ} `
          );
        }
        currentTime = currentTime.toString();
        let description = `***You are currently at section ${sectionNum}***\n\n`;

        if (goal === 0) {
          description += `*You haven't specified a goal yet. You might wanna use /goals to add one*`;
        } else if (goal > sectionNum) {
          let goalDistance = goal - sectionNum;
          description += `*You are ${goalDistance} sections away from your goal. Keep it up!*`;
        } else if (goal === sectionNum) {
          description += `***Congratulations!!  You have reached your goal !!. Use /goals to add a new goal***`;

          try {
            const newGoal = { goal: 0 };
            const yourId = { discordId: user.id };
            await users.findOneAndUpdate(yourId, newGoal, {
              new: true,
            });
          } catch (error) {
            console.log(error);
          }
        }

        const embed = new MessageEmbed()
          .setTitle(`**Way to go!  ${memberName}**`)
          .setDescription(description)
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
            return {
              custom: true,
              embeds: [embed],
              ephemeral: true,
            };
          } catch (error) {
            return {
              custom: true,
              content: `Sorry Something went wrong`,
            };
          }
        }
      } else if (subCommand === "showall") {
        let progress = await users.find().sort({ section: "desc" });
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
    } else {
      return {
        custom: true,
        ephemeral: true,
        content: "Please use this command on #sections",
      };
    }
  },
};
