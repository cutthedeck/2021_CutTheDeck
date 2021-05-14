const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./messages');
const {userJoin, getCurrentUser, getRoomUsers, userLeave} = require('./users');



const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Game stuff
const { makeid } = require('./utils');
const {initGame} = require('./server/warGame');
const { checkServerIdentity } = require('tls');
const gameRooms = {};
const state = {};

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

    // Game stuff
    if (socket.id in gameRooms) {
      let gameRoom = gameRooms[socket.id];
      io.sockets.in(gameRooms[socket.id]).emit("playerDisconnect");
    }

  });


  // Game stuff

  socket.on('replay', ( )=> {
    let gameRoom = gameRooms[socket.id];
    let replayGame = state[gameRoom].get("replay");

    if (replayGame) {
      startGame();
    } else {
      state[gameRoom].set("replay", true);
    }
  });
  
  socket.on('collect', playerNumber => {
    let gameRoom = gameRooms[socket.id];
    let player1BattleLength = state[gameRoom].get("player1BattleCards").cards.length;
    let player2BattleLength = state[gameRoom].get("player2BattleCards").cards.length;
    let playerDiscard;

    for(let i = 0; i < player1BattleLength; i++) {
      io.sockets.in(gameRoom).emit("flipCardUp", {fromDeckName: "player1BattleCards", cardIndex: i});
    }

    for(let i = 0; i < player2BattleLength; i++) {
      io.sockets.in(gameRoom).emit("flipCardUp", {fromDeckName: "player2BattleCards", cardIndex: i});
    }

    // Send cards to winner
    if (playerNumber == 1) {
      playerDiscard = "player1Discard";
    } else {
      playerDiscard = "player2Discard";
    }

    setTimeout(function() {
      for(let i = 0; i < player1BattleLength; i++) {
        handleMoveCard("player1BattleCards", playerDiscard);
        io.sockets.in(gameRoom).emit("flipCardUp", {fromDeckName: playerDiscard, cardIndex: -1});
      }
  
      for(let i = 0; i < player2BattleLength; i++) {
        handleMoveCard("player2BattleCards", playerDiscard);
        io.sockets.in(gameRoom).emit("flipCardUp", {fromDeckName: playerDiscard, cardIndex: -1});
      }

      io.sockets.in(gameRooms[socket.id]).emit("changeMode", {playerNumber: false, newMode: "play"});
      state[gameRoom].set("player1Compare", false);
      state[gameRoom].set("player2Compare", false);

      checkCardsLeft(playerNumber);
    }, 200);

    
  }); 

  socket.on('joinGame', (gameName, gameRoom) => {
    let roomToJoin = socket.adapter.rooms.get(gameRoom);
    let numOfPlayers = 0;

    if (roomToJoin) {
      numOfPlayers = roomToJoin.size;
    }



    // Join non existant game
    if (numOfPlayers === 0) {
      socket.emit('sendMessage', 'That game does not exist');
      return;
    }
    // Join full game
    else if (numOfPlayers > 1) {
      socket.emit('sendMessage', 'That game is full.');
      return;
    }
    // Join game w/user waiting
    // This starts play
    else {
      gameRooms[socket.id] = gameRoom;
      socket.join(gameRoom);
      socket.emit('playerNumber', 2);
      startGame();
      // io.sockets.in(gameRoom).emit('gameReady');

      // // Start game
      // state[gameRoom] = initGame();
      // populateMainDeck(gameRoom);
    }

  });

  socket.on('createGame', gameName => {
    let gameRoom = makeid(5);
    gameRooms[socket.id] = gameRoom;
    socket.emit('sendRoomName', gameRoom);

    socket.join(gameRoom);

    socket.number = 1;
    socket.emit('playerNumber', 1);
  });

  socket.on('layCard', playerNumber => {
    let playerDeck;
    let playerBattleCards;
    let playerCompare;
    let gameRoom = gameRooms[socket.id];

    if (playerNumber == 1) {
      playerDeck = "player1Deck";
      playerBattleCards = "player1BattleCards";
      playerCompare = "player1Compare";
    } else {
      playerDeck = "player2Deck";
      playerBattleCards = "player2BattleCards";
      playerCompare = "player2Compare";
    }

    handleMoveCard(playerDeck, playerBattleCards);

    let hasCards = checkCardsLeft(playerNumber);
    let battleCardCount = state[gameRoom].get(playerBattleCards).cards.length;

    // Flip up if last card or not buried
    if (!hasCards || (battleCardCount - 1) % 4 == 0) {
      state[gameRoom].set(playerCompare, true);
      io.sockets.in(gameRooms[socket.id]).emit("flipCardUp", {fromDeckName: playerBattleCards, cardIndex: -1});
      io.sockets.in(gameRooms[socket.id]).emit("changeMode", {playerNumber: playerNumber, newMode: "wait"});
      handleCompare();
    }
  });

  // Game functions
  function populateMainDeck(gameRoom) {

    cardRefs = state[gameRoom].get("cardRefs");
    cardRefs.forEach(card => {
      state[gameRoom].get("mainDeck").addCard(card);
      handleAddCard("mainDeck", card.id);
    });

    // Shuffle after delay then deal after delay
    setTimeout(function() {
      handleShuffle("mainDeck");

      setTimeout(function() {

        let i = 51;
        while (i >= 0) {
          if ( i%2 ) {
            handleMoveCard("mainDeck", "player1Deck");
          } else {
            handleMoveCard("mainDeck", "player2Deck");
          }
          i--;
        }

        // Send instruction to start game
        io.sockets.in(gameRooms[socket.id]).emit("changeMode", {playerNumber: false, newMode:"play"});
      }, 2000);
    }, 200);
    
  }
  
  function handleAddCard(deck, cardId) {
    io.sockets.in(gameRooms[socket.id]).emit("addCard", { deck: deck, cardId: cardId });
  }

  function handleShuffle(deck) {

    let gameRoom = gameRooms[socket.id];

    state[gameRoom].get(deck).shuffle();
    io.sockets.in(gameRoom).emit("shuffle", { collectionName: deck, deck: state[gameRoom].get(deck) });
  }

  function handleMoveCard(fromDeckName, toDeckName) {
    let gameRoom = gameRooms[socket.id];

    // Remove
    let card = state[gameRoom].get(fromDeckName).removeCard();
    io.sockets.in(gameRoom).emit("removeCard", fromDeckName);
    // Add
    state[gameRoom].get(toDeckName).addCard(card);
    handleAddCard(toDeckName, card.id);

  }

  function handleCompare() {
    let gameRoom = gameRooms[socket.id];
    let player1Compare = state[gameRoom].get("player1Compare");
    let player2Compare = state[gameRoom].get("player2Compare");

    if (player1Compare && player2Compare) {
      let player1Value = state[gameRoom].get("player1BattleCards").getLastCard().value;
      let player2Value = state[gameRoom].get("player2BattleCards").getLastCard().value;
      let player1CardsLeft = checkCardsLeft(1);
      let player2CardsLeft = checkCardsLeft(2);

      // Player 1 Wins Battle
      if (player1Value > player2Value) {

        // Player 1 Wins Game!
        if (!player2CardsLeft) {
          io.sockets.in(gameRooms[socket.id]).emit("gameOver", 1);
          io.sockets.in(gameRooms[socket.id]).emit("changeMode", {playerNumber: 0, newMode: "newGame"});
        }

        else {
          io.sockets.in(gameRooms[socket.id]).emit("changeMode", {playerNumber: 1, newMode: "collect"});
        }
        
      } 
      
      // Player 2 Wins Battle
      else if(player2Value > player1Value) {

        // Player 2 Wins Game!
        if (!player1CardsLeft) {
          io.sockets.in(gameRooms[socket.id]).emit("gameOver", 2);
          io.sockets.in(gameRooms[socket.id]).emit("changeMode", {playerNumber: 0, newMode: "newGame"});
        }

        else {
          io.sockets.in(gameRooms[socket.id]).emit("changeMode", {playerNumber: 2, newMode: "collect"});
        }

      } 
      
      // Battle ties
      else {

        // Check leftover cards
        if (!player1CardsLeft) {

          if (!player2CardsLeft) {

            // Both players out
            io.sockets.in(gameRooms[socket.id]).emit("gameOver", 0);
            io.sockets.in(gameRooms[socket.id]).emit("changeMode", {playerNumber: 0, newMode: "newGame"});
          } else {

            // Player 1 out
            io.sockets.in(gameRooms[socket.id]).emit("gameOver", 2);
            io.sockets.in(gameRooms[socket.id]).emit("changeMode", {playerNumber: 0, newMode: "newGame"});
          }

        } 
        
        // Player 2 out
        else if (!player2CardsLeft) {
          io.sockets.in(gameRooms[socket.id]).emit("gameOver", 1);
          io.sockets.in(gameRooms[socket.id]).emit("changeMode", {playerNumber: 0, newMode: "newGame"});
        }

        // Cards left
        else {
          io.sockets.in(gameRooms[socket.id]).emit("changeMode", {playerNumber: false, newMode: "play"});
          state[gameRoom].set("player1Compare", false);
          state[gameRoom].set("player2Compare", false);
        }
        
      }
      

    }
  }

  function checkCardsLeft(playerNumber) {
    let gameRoom = gameRooms[socket.id];
    let playerDeck;
    let playerDiscard;
    
    if (playerNumber == 1) {
      playerDeck = "player1Deck";
      playerDiscard = "player1Discard";
    } else {
      playerDeck = "player2Deck";
      playerDiscard = "player2Discard";
    }

    // Check players deck first then discard
    let hasCards = state[gameRoom].get(playerDeck).hasCards();

    if (!hasCards) {
      hasCards = state[gameRoom].get(playerDiscard).hasCards();

      // Move cards then shuffle
      if (hasCards) {
        while (state[gameRoom].get(playerDiscard).hasCards()) {
          handleMoveCard(playerDiscard, playerDeck);
          io.sockets.in(gameRoom).emit("flipCardDown", {fromDeckName: playerDeck, cardIndex: -1});
        }

        handleShuffle(playerDeck);
      }

    }

    return hasCards;
  }

  function startGame() {
    let gameRoom = gameRooms[socket.id];
    io.sockets.in(gameRoom).emit('gameReady');

    // Start game
    state[gameRoom] = initGame();
    populateMainDeck(gameRoom);
  }
});

const PORT = process.env.PORT || 300;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
