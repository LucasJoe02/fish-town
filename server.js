// server.js
const express = require('express');
const path = require('path');
const browserSync = require('browser-sync').create();

const app = express();
const PORT = 3000;

// Serve static files from the root directory
app.use(express.static(__dirname));

// Route for root path to serve index.html from the html folder
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'index.html'));
});

// Start the Express server
const server = app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// Initialize BrowserSync
browserSync.init({
  proxy: `http://localhost:${PORT}`,
  files: ['css/*.css', 'js/*.js', 'html/*.html'],
  port: 3001
});