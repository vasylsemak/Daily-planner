const express = require('express');
const date = require(__dirname + '/date.js');
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const items = ['Eat', 'Play Piano', 'Study'];
const workItems = [];


app.get('/', (req, res) => {
  const today = date.getDate();

  res.render('index', {
    listTitle: today,
    newListItems: items,
  });
});


app.post('/', (req, res) => {
  let item = req.body.newItem;
  items.push(item);

  res.redirect('/');
});

app.listen(3000, () => console.log('Server is running on port 3000.'));
