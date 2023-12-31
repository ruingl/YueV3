const connectDB = require('../connectDB');

function handleKickEvent(api, event) {
  const { threadID, author, logMessageData } = event;
  const groupName = logMessageData.name;

  // Remove group from the database
  connectDB.removeThread(threadID);

  // Send information to admin
  const adminUID = api.getCurrentUserID(); // Use your admin's UID here
  const adminMessage = `❌ Event: Bot has been kicked from a group\n\nName: ${groupName}\nThreadID: ${threadID}\nKicked by: ${author}`;
  api.sendMessage(adminMessage, adminUID);
}

module.exports = { handleKickEvent };
