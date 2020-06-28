const express = require('express');
const mongoose = require('mongoose');
const app = express();
// const date = require(__dirname + '/date.js');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


//   Mongoose connection and model
mongoose.connect('mongodb://localhost:27017/dailyplannerDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
});

const Task = mongoose.model('Task', taskSchema);

const hi = new Task({
  title: 'Welcome to your planner',
});
const graduate = new Task({
  title: 'Graduate from Fullstack',
});
const switzerland = new Task({
  title: 'Move to Switzerland permanently',
});

const defaultTasks = [hi, graduate, switzerland];

Task.insertMany(defaultTasks, (error) => {
  if (error) console.log(error);
  else console.log('Successfully saved default tasks');
});

app.get('/', (req, res, next) => {

  res.render('index', {
    listTitle: "Home",
    newListItems: items,
  });
});


app.get('/work', (req, res, next) => {
  res.render('index', {
    listTitle: 'Work',
    newListItems: workItems,
  });
});


app.post('/', (req, res, next) => {
  let item = req.body.newItem;

  if (req.body.buttonItem === 'Work') {
    workItems.push(item);
    res.redirect('/work');
  } else {
    items.push(item);
    res.redirect('/');
  }
});

app.listen(3000, () => console.log('Server is running on port 3000.'));
