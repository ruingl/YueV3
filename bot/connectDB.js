// Temp disabled cause of bug

/*
const fs = require('fs');

function loadDatabase() {
  const users = JSON.parse(fs.readFileSync('database/users.json', 'utf8'));
  const threads = JSON.parse(fs.readFileSync('database/threads.json', 'utf8'));

  return { users, threads };
}

function saveDatabase(database) {
  fs.writeFileSync('database/users.json', JSON.stringify(database.users, null, 2));
  fs.writeFileSync('database/threads.json', JSON.stringify(database.threads, null, 2));
}

module.exports = {
  connectDB: function () {
    const database = loadDatabase();

    return {
      addUser: function (user) {
        if (!database.users.some(u => u.uid === user.uid)) {
          database.users.push(user);
          saveDatabase(database);
          console.log(`[ ${getCurrentTimestamp()} ] ✅ Added ${user.name} | UID: ${user.uid} | Vanity: ${user.vanity}`);
        }
      },

      addThread: function (thread) {
        if (!database.threads.some(t => t.threadID === thread.threadID)) {
          database.threads.push(thread);
          saveDatabase(database);
          console.log(`[ ${getCurrentTimestamp()} ] ✅ Added Thread | ThreadID: ${thread.threadID}`);
        }
      },

      listUsers: function () {
        return database.users;
      },

      removeThread: function (threadID) {
        const index = database.threads.findIndex(t => t.threadID === threadID);
        if (index !== -1) {
          database.threads.splice(index, 1);
          saveDatabase(database);
          console.log(`[ ${getCurrentTimestamp()} ] ❌ Removed Thread | ThreadID: ${threadID}`);
        }
      },
    };
  },
};
*/