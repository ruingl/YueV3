module.exports = {
  config: {
    name: "test",
    description: "Test command",
    author: "Rui",
    usage: "{p}test",
  },

  run: (context) => {
    const { api, event } = context;
    
    api.sendMessage("test command executed", event.threadID);
  }
};
