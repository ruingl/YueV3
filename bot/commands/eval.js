const fs = require('fs');

module.exports = {
  config: {
    name: 'eval',
    description: 'Executes the provided JavaScript code',
    usage: ':eval <code>',
    author: 'LiANE',
    role: 1,
  },
  run: async ({ api, event, box }) => {
    try {

      const args = event.body.split(' ');
      const code = args.slice(1).join(' ');
      eval(code);
    } catch (error) {
      box.reply(`🔥 | Oops! may iror
Error: ${error.message}

`);
    }
  },
};