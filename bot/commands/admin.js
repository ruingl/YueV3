const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "admin",
    description: "Manage admin users.",
    usage: "{p}admin list/add/remove <user_id>",
    role: 1, // Admin only
  },
  run: ({ api, event, args, box }) => {
    const [action, userId] = args;

    if (!action) {
      box.reply("Please provide the action (list/add/remove).");
      return;
    }

    const configPath = path.join(__dirname, 'config.json');
    let config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

    switch (action.toLowerCase()) {
      case 'list':
        const adminList = config.admins || [];
        const adminListText = adminList.length > 0 ? adminList.join(', ') : 'No admin users.';
        box.reply(`Admin Users:\n${adminListText}`);
        break;

      case 'add':
        if (!userId) {
          box.reply("Please provide the user ID to add as an admin.");
          return;
        }

        if (!config.admins) {
          config.admins = [];
        }

        if (!config.admins.includes(userId)) {
          config.admins.push(userId);
          fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
          box.reply(`User ${userId} added as an admin.`);
        } else {
          box.reply(`User ${userId} is already an admin.`);
        }
        break;

      case 'remove':
        if (!userId) {
          box.reply("Please provide the user ID to remove from admin.");
          return;
        }

        if (config.admins && config.admins.includes(userId)) {
          config.admins = config.admins.filter(admin => admin !== userId);
          fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
          box.reply(`User ${userId} removed from admin.`);
        } else {
          box.reply(`User ${userId} is not an admin.`);
        }
        break;

      default:
        box.reply("Invalid action. Use list, add, or remove.");
    }
  },
};
