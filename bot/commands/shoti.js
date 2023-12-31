const axios = require("axios");
const request = require('request');
const fs = require("fs");

module.exports = {
  config: {
    name: "shoti",
    description: "Generate random tiktok girl videos",
    author: "libyzxy0 | Port by Rui",
    usage: "{p} - shoti",
    role: 0, // 0 - Everyone, 1 - Admin
  },
  run: async ({ api, event, box }) => {
    try {
      const response = await axios.post('https://shoti-api.libyzxy0.repl.co/api/get-shoti', { apikey: "$shoti-1hed1u48bmfllm5juu8" });
      const file = fs.createWriteStream(__dirname + "/cache/shoti.mp4");
      const rqs = request(encodeURI(response.data.data.url));

      rqs.pipe(file);

      file.on('finish', () => {
        api.sendMessage({
          body: `@${response.data.user.username}`, 
          attachment: fs.createReadStream(__dirname + '/cache/shoti.mp4')
        }, event.threadID, event.messageID);
      });

      file.on('error', (err) => {
        api.sendMessage(`Shoti Error: ${err}`, event.threadID, event.messageID);
      });
    } catch (error) {
      api.sendMessage(`Shoti API Error: ${error.message}`, event.threadID, event.messageID);
    }
  },
};
