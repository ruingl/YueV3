// const connectDB = require('../connectDB.js');

module.exports = {
  config: {
    name: 'listusers',
    description: 'Lists all users in the database.',
    usage: '{p}listusers',
    role: 1,
  },
  run: ({ api, event, args }) => {
    // Get the list of users from the database
    const users = connectDB.listUsers();

    // Format the user information
    const userMessage = users.map(user => `UID: ${user.uid} | Name: ${user.name} | Vanity: ${user.vanity}`).join('\n');

    // Send the list to the user
    api.sendMessage(`List of Users:\n${userMessage}`, event.threadID, event.messageID);
  },
};
