require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Note = require('./note');

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>');
});

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id);
  Note.findById(id).then(note => {
    response.json(note);
  })
});

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id);
  Note.findByIdAndRemove(id)
    .then((response) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.put('/api/notes/:id', (request, response) => {
  const body = request.body;
  const id = Number(request.params.id);

  const note = {
    content: body.content,
    important: body.important
  }

  Note.findByIdAndUpdate(id, note, { new: true })
    .then((updatedNote) => {
      response.json(updatedNote);
    })
    .catch((error) => next(error));
});

app.post('/api/notes', (request, response) => {
  const body = request.body;

  if (body.content === undefined) {
    return response.status(400).json({
      error: 'Content Missing'
    });
  };

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  });

  note.save().then(savedNote => {
    response.json(savedNote);
  })
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});