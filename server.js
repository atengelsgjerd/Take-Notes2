// Purpose: This file is the entry point for the application. It will start the server and listen for incoming requests.

const express = require('express');
const path = require('path');
const fs = require('fs');

const uuId = require('./helpers/randomId.js');

const db = require('./db/db.json');

const PORT = process.env.PORT || 3001;

// Create an instance of the express app.

const app = express();


// Middleware for parsing JSON and urlencoded form data

app.use(express.static('public'));
app.use(express.json());


// Parse incoming string or array data

app.use(express.urlencoded({ extended: true }));

//html routes

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, + '/public/index.html'));
});

//notes route

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});

//api routes
app.get('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to read file' });
    } else {
      const allData = JSON.parse(data);
      res.json(allData);
    }
  });
});



app.post('/api/notes', (req, res) => {
  const newNote = {
    id: uuId(),
    title: req.body.title,
    text: req.body.text
  };
  
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const notes = JSON.parse(data);
    notes.push(newNote);

    fs.writeFile('./db/db.json', JSON.stringify(notes, "", 4), (err) => {
      if (err) {
        console.error(err);
        return;
      }
      res.json(newNote);
    });
  });
})

//Delete notes
app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    const notes = JSON.parse(data);
    const newNotes = notes.filter((note) => note.id !== noteId);

    fs.writeFile('./db/db.json', JSON.stringify(newNotes, "", 4), (err) => {
      if (err) {
        console.error(err);
        return;
      }
      res.json({ success: 'Note deleted' });
    });
  });
});

//Fallback route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

// Listen for incoming requests

app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});