const axios = require('axios');

module.exports = {
  config: {
    name: "gd",
    version: "1.0",
    author: "LiANE",
    description: "Fetch information from Geometry Dash API."
  },

  run: async function ({ box, args }) {
    try {
      const argType = args[0];
      const inputValue = args[1];

      if (!argType || !inputValue) {
        return message.reply("❌ | Invalid argument. Please use 'user' or 'level'.");
      }

      let apiEndpoint;
      if (argType.toLowerCase() === "user") {
        apiEndpoint = `https://lianeapi.onrender.com/gd/user?username=${inputValue}`;
        
      } else if (argType.toLowerCase() === "level") {
        apiEndpoint = `https://lianeapi.onrender.com/gd/level?levelID=${inputValue}`;
        
      } else {
        return box.reply("❌ | Invalid argument. Please use 'user' or 'level'.");
      }

      const response = await axios.get(apiEndpoint);
      box.reply(response.data.message);
    } catch (error) {
      console.error(error);
      box.reply("❌ | Error fetching information from Geometry Dash API.");
    }
  }
};