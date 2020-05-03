const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 3000;

const chats = require('./chats');
const { v4: uuidv4 } = require('uuid');
app.use(cookieParser());
app.use(express.static('./public'));

/** login **/
app.post('/session', express.json(), (req, res) => {
  const username = req.body.username;
  if(!username || username.trim().length === 0 || username.indexOf('dog') >= 0) {
    res.status(400).json({ error: 'bad-login'});
    return;
  }
  const uid = uuidv4();
  chats.users[uid] = username;
  res.cookie('uid', uid);
  res.json({
    usernames: Object.values(chats.users),
    messages: chats.messages,
    currentUser: chats.users[uid]
  });
});

/** logout **/
app.delete('/session', (req, res) => {
  const uid = req.cookies.uid;
  if(!uid) {
    res.status(401).json({ error: 'missing-uid'});
    return;
  }
  if(!chats.users[uid]) {
    res.clearCookie('uid');
    res.status(403).json({ error: 'invalid-uid'});
    return;
  }
  delete chats.users[uid];
  res.clearCookie('uid');
  res.json({
    usernames: [],
    messages: []
  });
});

/** fetch chat app content(messages and users) **/
app.get('/chatStatus', (req, res) => {
  const uid = req.cookies.uid;
  if(!uid) {
    res.status(401).json({ error: 'missing-uid'});
    return;
  }
  if(!chats.users[uid]) {
    res.clearCookie('uid');
    res.status(403).json({ error: 'invalid-uid'});
    return;
  }
  res.json({
    usernames: Object.values(chats.users),
    messages: chats.messages,
    currentUser: chats.users[uid]
  });
});

/** post message **/
app.post('/messages', express.json(), (req, res) => {
  const uid = req.cookies.uid;
  if(!uid) {
    res.status(401).json({ error: 'missing-uid'});
    return;
  }
  if(!chats.users[uid]) {
    res.clearCookie('uid');
    res.status(403).json({ error: 'invalid-uid'});
    return;
  }
  const text = req.body.text;
  if(!text || text.trim().length === 0) {
    res.status(400).json({ error: 'empty-message'});
    return;
  }
  const message = {
    text: text,
    sender: chats.users[uid],
    timestamp: new Date().toLocaleString()
  };
  chats.messages.push(message);
  res.json(chats.messages);
});

app.listen(PORT, () => console.log("Listening to http://localhost:3000"));
