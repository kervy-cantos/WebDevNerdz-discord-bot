const DiscordJS = require("discord.js");
const WOKCommands = require("wokcommands");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

const { Intents } = DiscordJS;

const client = new DiscordJS.Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
});

client.on("ready", () => {
  const dbOptions = {
    keepAlive: true,
  };
  new WOKCommands(client, {
    commandsDir: path.join(__dirname, "commands"),
    testServers: ["780208322720432148", "982073575831920690"],
    dbOptions,
    mongoUri: process.env.DATABASE,
    botOwners: ["534755194722975765"],
  });
});

client.login(process.env.BOT_TOKEN);
