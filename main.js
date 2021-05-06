const chatForm = document.getElementById('chat-form');
const chatMessage = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const username = window.localStorage.getItem('user');
console.log(username);
const room = document.getElementById('room').innerText;



// get the user name and room from the url


// checking to see if the room and username were grabbed by the Qs library
console.log(username, room);

const socket = io();

// join chat
socket.emit('joinRoom', {username, room});

// get room and users
socket.on('roomUsers', ({room, users})=>{
  outPutRoomName(room);
  outPutUsers(users);


});

// Message from server
socket.on('message', message =>{
  console.log(message.username);
  outputMessage(message);

  // Scroll down on chatbox everytime there is a new message
  chatMessage.scrollTop = chatMessage.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', (e)=>{
  e.preventDefault();


  // get the message typed from the chat input box
  const msg = e.target.elements.msg.value;

  // emit message to server
  socket.emit('chatMessage', msg);

  // clear input box
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();


});

// output message to Dom
function outputMessage(message){


  if(message.username == username){
    const div = document.createElement('div');
    div.classList.add('message');
    div.setAttribute("style", "max-width: 160px;position:relative;right: -200px;font-size:.95em;");
    div.innerHTML = `<p class="meta">${message.username}<span> ${message.time}</span></p>
    <p class="text"> ${message.text} </p>`;
    document.querySelector('.chat-messages').appendChild(div);

  }else if(message.username == "Admin"){
    const div = document.createElement('div');
    div.setAttribute("style", "max-width: 500px;text-align: center;background-color:red; font-size:.95em;position:relative;right: -20px;");
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username}x<span> ${message.time}</span></p>
    <p class="text"> ${message.text} </p>`;
    document.querySelector('.chat-messages').appendChild(div);

  }else {
    const div = document.createElement('div');
    div.classList.add('message');
    div.setAttribute("style", "max-width: 160px;relative;left: 2px;background-color:orange");
    div.innerHTML = `<p class="meta">${message.username}<span> ${message.time}</span></p>
    <p class="text"> ${message.text} </p>`;
    document.querySelector('.chat-messages').appendChild(div);
  }

}

//"style", "max-width: 160px;position:relative;right: -200px;font-size:.95em;


// add room/name
function outPutRoomName(room){
  roomName.innerText = room;

  
}

// add users to dom
function outPutUsers(users){
  userList.innerHTML = `
  ${users.map(user => `<li>${user.username}</li>`).join('')}`;
  
}