const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { exec } = require('child_process');

function getPrefix() {
  const configPath = path.join(__dirname, 'config.json');
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  return config.commandPrefix || '/';
}

module.exports = {
  config: {
    name: "module",
    description: "Install, uninstall, or sync modules.",
    usage: "{p}module install/uninstall/sync/help <code/pastebinrawlink>",
    role: 1, // 0 - Everyone, 1 - Admin
  },
  run: async ({ api, event, args, box }) => {
    const [action, moduleLink] = args;

    if (!action) {
      box.reply("Please provide the action (install/uninstall/sync/help).");
      return;
    }

    try {
      const moduleName = path.basename(moduleLink || '', '.js');

      switch (action.toLowerCase()) {
        case 'install':
        case 'installcode':
          if (!moduleLink) {
            box.reply("Please provide the module link for installation.");
            return;
          }

          // Download module from the provided link
          const response = await axios.get(moduleLink);
          const moduleCode = response.data;

          // Save the module code to a temporary file
          const tempFilePath = path.join(__dirname, `${moduleName}.js`);
          fs.writeFileSync(tempFilePath, moduleCode);

          // Install the module using child_process (exec)
          exec(`cp ${tempFilePath} ./modules/${moduleName}.js`, (err) => {
            if (err) {
              console.error('Error installing module:', err);
              box.reply('An error occurred while installing the module.');
            } else {
              box.reply('Module installed successfully!');
            }

            // Clean up: remove the temporary file
            fs.unlinkSync(tempFilePath);
          });
          break;

        case 'uninstall':
          if (!moduleName) {
            box.reply("Please provide the module name for uninstallation.");
            return;
          }

          // Uninstall the module using child_process (exec)
          exec(`rm ./modules/${moduleName}.js`, (err) => {
            if (err) {
              console.error('Error uninstalling module:', err);
              box.reply('An error occurred while uninstalling the module.');
            } else {
              box.reply('Module uninstalled successfully!');
            }
          });
          break;

        case 'sync':
          // Sync node_modules using child_process (exec)
          exec('npm i', (err) => {
            if (err) {
              console.error('Error syncing node_modules:', err);
              box.reply('An error occurred while syncing node_modules.');
            } else {
              box.reply('Node modules synced successfully!');
            }
          });
          break;

        case 'help':
          box.reply(`Module Command Help:

- ${getPrefix()}module install <pastebinrawlink> : Install a module using a pastebin raw link.
- ${getPrefix()}module installcode <code> : Install a module using inline code.
- ${getPrefix()}module uninstall <moduleName> : Uninstall a module by name.
- ${getPrefix()}module sync : Sync node_modules using npm.
- ${getPrefix()}module help : Display this help message.`);
          break;

        default:
          box.reply('Invalid action. Please use "install", "uninstall", "sync", or "help".');
          break;
      }
    } catch (error) {
      console.error('Error handling module:', error.message);
      box.reply('An error occurred while handling the module.');
    }
  },
};
