const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const port = process.env.PORT || 4001;
const index = require("./routes/index");

const app = express();
app.use(index);

const server = http.createServer(app);

const io = socketIo(server);

const comments = [];

io.on('connection', socket => {
  console.log('Client has connected');
  
  socket.emit('loadComments', comments);

  socket.on('disconnect', () => console.log('Client disconnected'));

  socket.on('submitComment', comment => {
    comments.push(comment);
    console.log('comments', comments);
    console.log('new comment', comment);
    socket.broadcast.emit('receiveComment', comment);
  });

});

server.listen(port, () => console.log(`Listening on port ${port}`));