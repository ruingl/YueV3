const connectDB = require('../connectDB');

function handleAddEvent(api, event) {
  const { threadID, author, logMessageData } = event;
  const groupName = logMessageData.name;

  // Add group to the database
  connectDB.addGroup(threadID, groupName);

  // Add user to the database
  connectDB.addUser({ uid: author, name: '', vanity: '', banned: false });

  // Send information to admin
  const adminUID = api.getCurrentUserID(); // Use your admin's UID here
  const adminMessage = `✅ Event: Bot has been added to a group\n\nName: ${groupName}\nThreadID: ${threadID}\nAdded by: ${author}`;
  api.sendMessage(adminMessage, adminUID);
}

module.exports = { handleAddEvent };
