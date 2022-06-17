const axios = require("axios");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "mdn",
  category: "Code Help",
  description: "Searches the official MDN documentation.",

  slash: "both",
  testOnly: true,
  guildOnly: true,

  minArgs: 1,
  expectedArgs: "<search-query>",

  callback: async ({ text }) => {
    const base = "https://developer.mozilla.org";
    const uri = `${base}/api/v1/search?q=${encodeURIComponent(
      text
    )}&locale=en-US`;

    const docs = (await axios(uri)).data.documents;

    if (docs) {
      const embed = new MessageEmbed()
        .setAuthor({
          name: `MDN DOCS`,
          iconURL: "https://iconape.com/wp-content/png_logo_vector/mdn.png",
        })
        .setColor(0xba55d3);

      let truncated = false;
      if (docs.length > 3) {
        docs.length = 3;
        truncated = true;
      }

      for (let { mdn_url, title, summary } of docs) {
        summary = summary.replace(/(\r\n|\n|\r)/gm, "");

        embed.addField(title, `${summary}\n[**Link HERE**](${base}${mdn_url})`);
      }

      if (truncated) {
        embed.addField(
          "Too many results!",
          `View more results [here](https://developer.mozilla.org/en-US/search?q=${encodeURIComponent(
            text
          )}).`
        );
      }

      return embed;
    }

    return "Could not find that documentation.";
  },
};
