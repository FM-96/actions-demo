require('dotenv').config();

const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const app = express();

const PORT = 12345;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/tag', (req, res) => {
  exec('git describe --tags', (err, stdout, stderr) => {
    if (err) {
      res.status(500).send(`Error: ${stderr}`);
      return;
    }
    res.send(`Success: ${stdout.trim()}`);
  });
});

app.get('/list', (req, res) => {
  fs.readdir('.', { withFileTypes: true }, (err, files) => {
    if (err) {
      res.status(500).send(`Error: ${err.message}`);
      return;
    }
    const folders = files.filter(file => file.isDirectory()).map(folder => `<li><b>${folder.name}</b></li>`);
    const regularFiles = files.filter(file => !file.isDirectory()).map(file => `<li>${file.name}</li>`);
    const fileList = folders.concat(regularFiles).join('');
    res.send(`Directory contents:<ul>${fileList}</ul>`);
  });
});

app.get('/env', (req, res) => {
    res.send(`NODE_ENV=${process.env.NODE_ENV}`);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

