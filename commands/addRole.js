const { MessageEmbed } = require("discord.js");

module.exports = {
  category: "Role Add",
  description: `Modify someone's role/s`,

  slash: "both",
  guildOnly: true,
  testOnly: true,
  permissions: ["ADMINISTRATOR"],

  options: [
    {
      name: "user",
      type: "USER",
      description: "The user you want to add role to.",
    },
    {
      name: "role",
      type: "ROLE",
      description: `role to add`,
    },
  ],

  callback: async ({ interaction, guild }) => {
    const user = interaction.options.getUser("user");
    const newRole = interaction.options.getRole("role");
    const member = await guild.members.fetch(user);
    const hey = member.roles.cache.has(newRole.id);
    if (!hey) {
      member.roles.add(newRole);
      interaction.reply("Role Added");
    } else {
      interaction.reply("Role Added.");
    }
  },
};
