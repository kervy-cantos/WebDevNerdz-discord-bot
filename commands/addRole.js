const { MessageEmbed } = require("discord.js");

module.exports = {
  category: "Role Add",
  description: `Modify someone's role/s`,

  slash: "both",
  guildOnly: true,
  testOnly: true,

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

  callback: async ({ interaction, member }) => {
    const user = interaction.options.getUser("user");
    const role = interaction.options.getRole("role");
    user?.roles.add(role);
    return {
      custom: true,
      content: `${user}, I added you the ${role} role`,
    };
  },
};
