const fs = require("fs");
const connectDB = require("./bot/connectDB");
const path = require("path");
const ora = require("ora");
const { handleAddEvent } = require("./bot/events/addEvent");
const { handleKickEvent } = require("./bot/events/kickEvent");

const configPath = "config.json";

// Load config
const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
const commandPrefix = config.commandPrefix || "/";
const commandPath = path.join(__dirname, "bot", "commands");

// Connect to SQLite database
// connectDB.connectDB();

// Bot logic
const botCommands = {};

// isAdmin function
function isAdmin(userId) {
  return config.admins.some((admin) => admin === userId);
}

module.exports = {
  getPrefix: getPrefix,
}

function getPrefix() {
  return config.commandPrefix || '/'; // Default to "/" if not specified in config
}

// loadCommands function
function loadCommands() {
  const commandFiles = fs
    .readdirSync(commandPath)
    .filter((file) => file.endsWith(".js"));

  commandFiles.forEach((file) => {
    const commandName = path.basename(file, ".js");
    const commandModule = require(path.join(commandPath, file));

    botCommands[commandName] = ({ api, event, args, box }) => {
      const userId = event.senderID;
      const commandConfig = commandModule.config || {};
      const commandRole = commandConfig.role || 0;

      if (commandRole === 0 || (commandRole === 1 && isAdmin(userId))) {
        commandModule.run({ api, event, args, box });
      } else {
        box.reply("You do not have permission to use this command.");
      }
    };
  });
}

loadCommands();

// Handle bot events
function handleBotEvents(api, event) {
  // Event: Bot added to a group
  if (event.type === "event" && event.logMessageType === "log:subscribe") {
    handleAddEvent(api, event);
  }

  // Event: Bot kicked from a group
  if (event.type === "event" && event.logMessageType === "log:unsubscribe") {
    handleKickEvent(api, event);
  }

  // Handle other bot events as needed
  // ...
  const react = (emoji) => {
    api.setMessageReaction(emoji, event.messageID, () => {}, true);
  };

  const reply = (msg) => {
    api.sendMessage(msg, event.threadID, event.messageID);
  };

  const add = (uid) => {
    api.addUserToGroup(uid, event.threadID);
  };

  const kick = (uid) => {
    api.removeUserFromGroup(uid, event.threadID);
  };

  const send = (msg) => {
    api.sendMessage(msg, event.threadID);
  };

  const box = {
    react: react,
    reply: reply,
    add: add,
    kick: kick,
    send: send,
  };

  try {
    if (event.body && event.body.toLowerCase() === "prefix") {
      api.sendMessage(
        `My prefix is: \`${commandPrefix}\``,
        event.threadID,
        event.messageID,
      );
    } else if (
      event.body &&
      event.body.toLowerCase().startsWith(commandPrefix)
    ) {
      const [command, ...args] = event.body
        .slice(commandPrefix.length)
        .trim()
        .split(" ");

      if (botCommands[command]) {
        botCommands[command]({ api, event, args, box });
      } else {
        api.sendMessage("Invalid command.", event.threadID, event.messageID);
      }
    }
  } catch (error) {
    console.error("Error occurred while executing command:", error);
    // Handle the error or log it to your preferred logging service
  }
}

// Create an API instance
const login = require("fca-unofficial");
login(
  { appState: JSON.parse(fs.readFileSync("appstate.json", "utf8")) },
  (err, api) => {
    if (err) return console.error(err);

    // Save app state after successful login
    fs.writeFileSync("appstate.json", JSON.stringify(api.getAppState()));

    // Start listening for bot events after successful login
    api.listen((listenErr, event) => {
      if (listenErr) return console.error(listenErr);

      // Call the function to handle bot events
      handleBotEvents(api, event);
    });
  },
);

function isAdmin(userId) {
  const admins = config.admins || [];
  return admins.some((admin) => admin === userId);
}
