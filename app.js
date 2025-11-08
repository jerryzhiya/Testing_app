const express = require('express');
const path = require('path');
const app = express();
require('dotenv').config();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

const messages = [];
const likes = {};
const comments = {};

app.get('/', (req, res) => {
    res.render('index', { title: 'Message Board', messages });
});

app.get('/new', (req, res) => {
    res.render('new', { title: 'New Messages' });

})
app.get('/messages/:id', (req, res)=> {
    const contents = messages.find(content => content.id === parseInt(req.params.id));
    if (!contents) {
        return res.status(404).render('404', {title: 'OOPS..... 404 page not Found'});
    }
    res.render('messages', {title: 'Message details', contents});
})

app.post('/messages/:id/like', (req, res) => {
  const id = req.params.id;
  if (likes[id] !== undefined) {
    likes[id]++;
    res.json({ likes: likes[id] });
  } else {
    res.status(404).json({ error: 'Message not found' });
  }
});

app.post('/messages/:id/comment', (req, res) => {
  const id = req.params.id;
  const { comment } = req.body;

  if (comments[id] !== undefined) {
    comments[id].push(comment);
    res.json({ comment });
  } else {
    res.status(404).json({ error: 'Message not found' });
  }
});

app.post('/new', (req, res) => {
  const { user, text } = req.body;
  const id = messages.length; 

  messages.push({
    id,
    user,
    text,
    added: new Date()
  });

  likes[id] = 0;    
  comments[id] = []; 

  res.redirect('/');
});
app.use((req, res)=> {
    res.status(404).render('404', {title: 'OOPS..... 404 page not Found'});
})

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`App is running at http://localhost:${PORT}`);
});
