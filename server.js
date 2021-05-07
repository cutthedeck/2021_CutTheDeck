const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./messages');
const {userJoin, getCurrentUser, getRoomUsers, userLeave} = require('./users');



const app = express();
const server = http.createServer(app);
const io = socketio(server);



// Set static folder
app.use(express.static(__dirname)); 

const Admin = 'Admin';

// Run when user connects
io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // Broadcast when a user connects
    if(user.username){
          // Welcome current user
    socket.emit('message', formatMessage(Admin, `Welcome to ${user.room} Game Chat Room`));
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(Admin, `${user.username} has joined the chat`)
      );
    

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  }
  });


  // Listen for chat Message
  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id);

    console.log(user.username);

    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  // Runs when user disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(Admin, `${user.username} has left the chat`)
      );

      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });
});

const PORT = process.env.PORT || 300;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
console.log("hello");