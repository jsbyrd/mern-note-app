const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>');
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@cluster0.gsjy09z.mongodb.net/noteApp?retryWrites=true&w=majority`;

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
});

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
});

const Note = mongoose.model('Note', noteSchema);

mongoose
  .connect(url)
  .then((res) => {
    console.log("Connected")

    // const note = new Note({
    //   content: "HTML is easy",
    //   date: new Date(),
    //   important: true,
    // });

    // return note.save();
    Note.find({}).then(result => {
      result.forEach(note => {
        console.log(note)
      })
      mongoose.connection.close()
    })
  })
  // .then(() => {
  //   console.log("Note saved!");
  //   return mongoose.connection.close();
  // })
  .catch((err) => console.log(err));