const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const figlet = require('figlet');
const ora = require('ora');
const chalk = require('chalk');
const { spawn } = require('child_process');

const app = express();
const port = 3000;

function getCurrentTimestamp() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  return `[ ${hours}:${minutes}:${seconds} ]`;
}

// Load config
const configPath = 'config.json';
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const dashboardConfig = config.dashboard || {};
const dashboardUsername = dashboardConfig.username || 'yuedashboard';
const dashboardPassword = dashboardConfig.password || 'yuedashboard';

// Middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Express route for serving the login page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'bot', 'dashboard', 'index.html'));
});

// Express route for handling login form submissions
app.post('/login', (req, res) => {
  const enteredUsername = req.body.username || '';
  const enteredPassword = req.body.password || '';

  if (enteredUsername === dashboardUsername && enteredPassword === dashboardPassword) {
    res.redirect('/dashboard/home'); // Redirect to the dashboard on successful login
  } else {
    res.status(401).send('Unauthorized'); // Authentication failed
  }
});

// Middleware for authentication
app.use((req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const credentials = Buffer.from(authHeader.split(' ')[1] || '', 'base64').toString('utf-8').split(':');
  const enteredUsername = credentials[0] || '';
  const enteredPassword = credentials[1] || '';

  if (enteredUsername === dashboardUsername && enteredPassword === dashboardPassword) {
    next(); // Authentication successful, proceed to the next middleware or route handler
  } else {
    res.status(401).send('Unauthorized'); // Authentication failed
  }
});


// Express route for serving the home page
app.get('/dashboard/home', (req, res) => {
  // Check if the user is authenticated
  if (req.isAuthenticated()) {
    res.sendFile(path.join(__dirname, 'bot', 'dashboard', 'home.html'));
  } else {
    res.redirect('/'); // Redirect to login if not authenticated
  }
});

// Express route for serving the users page
app.get('/dashboard/users', (req, res) => {
  // Check if the user is authenticated
  if (req.isAuthenticated()) {
    // Implement logic to fetch user data from the database and render the page
    res.send('Users Page - Under Construction');
  } else {
    res.redirect('/'); // Redirect to login if not authenticated
  }
});

// Express route for serving the groups page
app.get('/dashboard/groups', (req, res) => {
  // Check if the user is authenticated
  if (req.isAuthenticated()) {
    // Implement logic to fetch group data from the database and render the page
    res.send('Groups Page - Under Construction');
  } else {
    res.redirect('/'); // Redirect to login if not authenticated
  }
});

// ... (additional routes and logic for fetching data from the database, banning/unbanning, etc.)


// Start Express server
const serverSpinner = ora('Starting Express server').start();

app.listen(port, () => {
  figlet("Yue", function (err, data) {
    if (err) {
      console.log("Something went wrong...");
      console.dir(err);
      return;
    }
    console.log(chalk.yellow("--------------------"));
    console.log(chalk.blue(data));
    console.log(chalk.yellow("--------------------"));
    console.log("");
    console.log("Time started: " + `${chalk.blue(getCurrentTimestamp())}`);
    console.log("");
  });
  console.log(`${chalk.blue(getCurrentTimestamp())} ✅ Express server is running on port ${port}`);
  serverSpinner.succeed();
});

// Spawn yue.js process
const yueProcess = spawn('node', ['yue.js']);

yueProcess.stdout.on('data', (data) => {
  const logMessage = data.toString();
  ora(`${getCurrentTimestamp()} ✅ ${logMessage}`).succeed();
});

yueProcess.stderr.on('data', (data) => {
  const errorMessage = data.toString();
  ora(`${getCurrentTimestamp()} ❌ ${errorMessage}`).fail();
});

yueProcess.on('close', (code) => {
  if (code === 0) {
    ora(`${getCurrentTimestamp()} ✅ yue.js process exited successfully.`).succeed();
  } else {
    ora(`${getCurrentTimestamp()} ❌ yue.js process exited with code ${code}.`).fail();
  }
});
