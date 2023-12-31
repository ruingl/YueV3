module.exports = {
  config: {
    name: "Command Name",
    description: "Command Description",
    usage: "{p} - Usage",
    role: 0, // 0 - Everyone, 1 - Admin
  },
  run: ({ api, event, box }) => {
    api.sendMessage("Send message!", event.threadID);

    box.send("Shorter send message!");
  },
};

