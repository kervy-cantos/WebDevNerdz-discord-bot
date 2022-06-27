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

  callback: async ({ interaction, guild }) => {
    const user = interaction.options.getUser("user");
    const role = interaction.options.getRole("role");
    const member = await guild.members.fetch(user);
    member.roles.add(role);
    console.log(member);

    return {
      custom: true,
      content: `<@${member}>, I added you the ${role} role`,
    };
  },
};
