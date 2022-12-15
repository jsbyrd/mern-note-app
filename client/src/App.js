import { useEffect, useState } from 'react';
import noteService from './services/notes'

const Note = (props) => {
  const { note, toggleImportance } = props;
  const label = note.important
    ? "Make not important" : "Make important";
  return (
    <li className='note'>
      {note.content}
      &nbsp;&nbsp;
      <button onClick={toggleImportance}>{label}</button>
    </li>
  );
}

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className='error'>
      {message}
    </div>
  )
}

const Footer = () => {
  const footerStyle = {
    color: 'green',
    fontStyle: 'italic',
    fontSize: 16
  }
  return (
    <div style={footerStyle}>
      <br />
      <em>Note App, Department of Computer Science, University of Central Florida</em>
    </div>
  )
}

const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    noteService
      .getAll()
      .then(response => {
        setNotes(response.data)
      })
  }, []);

  const toggleImportance = (id) => {
    const note = notes.find(n => n.id === id);
    const changedNote = { ...note, important: !note.important };

    noteService
      .update(id, changedNote)
      .then(res => {
        setNotes(notes.map(note => note.id !== id ? note : res.data))
      })
      .catch(err => {
        setErrorMessage(`'${note.content}' was already removed from the server`);
      })
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000)
      setNotes(notes.filter(n => n.id !== id));
  }

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() < 0.5
    }
    
    noteService
      .create(noteObject)
      .then(response => {
        setNotes(notes.concat(response.data))
        setNewNote('')
      })
  }

  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
  }

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={handleNoteChange}
        />
        <button type="submit">Save</button>
      </form>
      <ul>
        {notes.map(note => 
          <Note 
            key={note.id} 
            note={note} 
            toggleImportance={() => toggleImportance(note.id)}/>
        )}
      </ul>
      <Footer />
    </div>
  )
};

export default App;
