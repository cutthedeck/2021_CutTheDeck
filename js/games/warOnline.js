$(function() {

	socket.on('sendMessage', (message)=>{
		alert(message);
	  });

	socket.on('sendRoomName', (roomName)=>{
		$("#message").html("<h3>Game ID: " + roomName + "</h3><br>");
		$("#message").append("<h2>Waiting for other player</h2>")
	});

	socket.on('gameReady', ()=>{

		$("#message").html("");
	});

	socket.on('playerNumber', (num) => {
		playerNumber = num;

		// Re-arrange for player 2
		if (playerNumber == 2) {
			playersDeck = player2Deck;
			playersDiscard = player2Discard;
			playersBattleCards = player2BattleCards;

			let oldX;
			let oldY;

			oldX = player1Deck.x;
			oldY = player1Deck.y;
			player1Deck.x = player2Deck.x;
			player1Deck.y = player2Deck.y;
			player2Deck.x = oldX;
			player2Deck.y = oldY

			oldX = player1Discard.x;
			oldY = player1Discard.y;
			player1Discard.x = player2Discard.x;
			player1Discard.y = player2Discard.y;
			player2Discard.x = oldX;
			player2Discard.y = oldY;

			oldX = player1BattleCards.x;
			oldY = player1BattleCards.y;
			player1BattleCards.x = player2BattleCards.x;
			player1BattleCards.y = player2BattleCards.y;
			player2BattleCards.x = oldX;
			player2BattleCards.y = oldY
			player2BattleCards.stagerX *= -1;
			player1BattleCards.stagerX *= -1;
		} else {
			playersDeck = player1Deck;
			playersDiscard = player1Discard;
			playersBattleCards = player1BattleCards;
		}

	});

	socket.on('addCard', function(data) {

		// Pick collection to add to based on passed in
		let cardId = data.cardId;
		let toDeck;
		switch (data.deck) {
			
			case "mainDeck":
				toDeck = mainDeck;
				break;
			case "player1Deck":
				toDeck = player1Deck;
				break;
			case "player2Deck":
				toDeck = player2Deck;
				break;
			case "player1Discard":
				toDeck = player1Discard;
				break;
			case "player2Discard":
				toDeck = player2Discard;
				break;
			case "player1BattleCards":
				toDeck = player1BattleCards;
				break;
			case "player2BattleCards":
				toDeck = player2BattleCards;
				break;
				
		}

		toDeck.addCard(cardRefs.get(cardId));
		toDeck.getLastCard().flipDown();
	});

	socket.on('removeCard', (fromDeckName) => {
		let fromDeck;

		switch (fromDeckName) {
			
			case "mainDeck":
				fromDeck = mainDeck;
				break;
			case "player1Deck":
				fromDeck = player1Deck;
				break;
			case "player2Deck":
				fromDeck = player2Deck;
				break;
			case "player1Discard":
				fromDeck = player1Discard;
				break;
			case "player2Discard":
				fromDeck = player2Discard;
				break;
			case "player1BattleCards":
				fromDeck = player1BattleCards;
				break;
			case "player2BattleCards":
				fromDeck = player2BattleCards;
				break;
		}


		fromDeck.removeCard();

	});

	socket.on('flipCardUp', function(data) {
		let fromDeck;
		let cardIndex = data.index;
		
		switch (data.fromDeckName) {
			
			case "mainDeck":
				fromDeck = mainDeck;
				break;
			case "player1Deck":
				fromDeck = player1Deck;
				break;
			case "player2Deck":
				fromDeck = player2Deck;
				break;
			case "player1Discard":
				fromDeck = player1Discard;
				break;
			case "player2Discard":
				fromDeck = player2Discard;
				break;
			case "player1BattleCards":
				fromDeck = player1BattleCards;
				break;
			case "player2BattleCards":
				fromDeck = player2BattleCards;
				break;
		}

		if (cardIndex = -1) {
			fromDeck.getLastCard().flipUp();
		} else {
			fromDeck.cards[cardIndex].flipUp();
		}
		
	});

	socket.on('flipCardDown', function(data) {
		let fromDeck;
		let cardIndex = data.index;
		
		switch (data.fromDeckName) {
			
			case "mainDeck":
				fromDeck = mainDeck;
				break;
			case "player1Deck":
				fromDeck = player1Deck;
				break;
			case "player2Deck":
				fromDeck = player2Deck;
				break;
			case "player1Discard":
				fromDeck = player1Discard;
				break;
			case "player2Discard":
				fromDeck = player2Discard;
				break;
			case "player1BattleCards":
				fromDeck = player1BattleCards;
				break;
			case "player2BattleCards":
				fromDeck = player2BattleCards;
				break;
		}

		if (cardIndex = -1) {
			fromDeck.getLastCard().flipDown();
		} else {
			fromDeck.cards[cardIndex].flipDown();
		}

	});

	socket.on('shuffle', function(data) {

		// Get ref to right deck
		let shufflingDeck;
		switch (data.collectionName) {

			case "mainDeck":
				shufflingDeck = mainDeck;
				break;
			case "player1Deck":
				shufflingDeck = player1Deck;
				break;
			case "player2Deck":
				shufflingDeck = player2Deck;
				break;
			case "player1Discard":
				shufflingDeck = player1Discard;
				break;
			case "player2Discard":
				shufflingDeck = player2Discard;
				break;
			case "player1BattleCards":
				shufflingDeck = player1BattleCards;
				break;
			case "player2BattleCards":
				shufflingDeck = player1BattleCards;
				break;

		}

		shufflingDeck.cards = [];
		data.deck.cards.forEach(function(card){
			shufflingDeck.addCard(cardRefs.get(card.id));
			
		});
		shufflingDeck.shuffle();
	});

	socket.on('changeMode', (data) => {
		if (!data.playerNumber || data.playerNumber == playerNumber) {
			changeMode(data.newMode);
		}
		
	});

	socket.on('gameOver', (winnerNumber) => {

		setTimeout(function(){
			if(!winnerNumber) {
				alert("It's a tie");
			} else if (winnerNumber == playerNumber) {
				alert("You win");
				saveResult(true, "warOnline");
			} else {
				alert("You lose!");
				saveResult(false, "warOnline");
			}
			changeMode("replay");
			replayMenu();
		}, 800);
		
	});

	socket.on('playerDisconnect', () => {
		if (currentMode == "replay") {
			alert("Other player disconnected");
		} else {
			alert("Other player disconnected, you win!");
			saveResult(true, "warOnline");
		}

		location.reload();
		//gameMenu();
		
	});
	
	class PlayArea {
		
		constructor(width, height, divId = "gameTable") {
			this.$selector = $("#" + divId);
			this.width = width;
			this.height = height;
			this.$selector.width(width);
			this.$selector.height(height);
			this.setOffsets();
			this.defaultStagerX = 0.3;
			this.defaultStagerY = -0.3;
		}
		
		setOffsets() {
			this.xOffset = this.$selector.offset().left;
			this.yOffset = this.$selector.offset().top;
		}
		
	}
	
	class Card {
	constructor(image, backImage, suit, face, x = 0, y = 0) {
		this.image = image;
		this.backImage = backImage;
		this.suit = suit;
		this.face = face;
		this.width = this.image.width;
		this.height = this.image.height;
		this.x = playArea.width / 2;
		this.y = playArea.height / 2;
		this.id = suit + face;
		this.faceUp = true;
		this.clickable = true;
		this.value;
		
		// Set value according to face
		if (Number.isFinite(face)) {
			this.value = face;
		} else {
			switch (face) {
				case "J":
					this.value = 11;
					break;
				case "Q":
					this.value = 12;
					break;
				case "K":
					this.value = 13;
					break;
				case "A":
					this.value = 14;
			}
		}
		
		// Add to html, get selector, and move into center
		let divString = "<div id='" + this.id  + "' class = 'card'></div>";
		playArea.$selector.append(divString);
		this.$selector = $("#" + this.id);
		//this.$selector.css({"left": this.x, "top": this.y});
		this.move(this.x, this.y, false)
	}
	
	hide() {
		this.$selector.html();
	}
	
	flipUp() {
		if (true || !this.faceUp) {
			this.faceUp = true;
			this.$selector.html(this.image);
		}
	}
	
	flipDown() {
		if (true || this.faceUp) {
			this.faceUp = false;
			this.$selector.html(this.backImage);
		}
	}
	
	flip() {
		if (this.faceUp) {
			this.flipDown();
		} else {
			this.flipUp();
		}
	}
		
	move(x,y,animate = true) {
		this.x = x;
		this.y = y;
		if (animate) {
			animationPlaying = true;
			this.$selector.animate({left: x - this.width / 2, top: y - this.height / 2}).promise().done(function() {
				animationPlaying = false;
			});
		} else {
			this.$selector.css({left: x - this.width / 2, top: y - this.height / 2});
		}
		
	}
}
	
	class CardCollection {
		constructor(x, y, stagerX = playArea.defaultStagerX, stagerY = playArea.defaultStagerY,  cards = []) {
			this.x = x;
			this.y = y;
			this.stagerX = stagerX;
			this.stagerY = stagerY;
			this.cards = cards;
		}
		
		addCard(card, move = true) {
			this.cards.push(card);
			card.$selector.css({"outline": "none", "z-index": highestZ});
			highestZ += 1;
			if (move) {
				card.move(this.x + this.cards.length * this.stagerX, this.y + this.cards.length * this.stagerY);

			}

		}
		
		removeCard(index = -1) {
			let removed;
			if (index == -1) {
				if (this.cards.length) {
					removed = this.cards.pop();
				}
			}
			
			return removed;
		}
		
		getLastCard() {
			return this.cards[this.cards.length - 1];
		}
		
		hasCards() {
			return this.cards.length > 0;
		}
		
		shuffle(animate = true) {
		
			if (animate) {
				
				let originX = this.cards[0].x;
				for (let times = 0; times < 2; times++) {
					for (let i = 0; i < this.cards.length; i++) {
						let seperation = 60;
						let card = this.cards[i];
						// Move to different piles based on odd/even
						// then move back
						if (i % 2) {
							card.move(card.x - seperation, card.y, true);
							card.move(card.x + seperation, card.y, true);
						} else {
							card.move(card.x + seperation, card.y, true);
							card.move(card.x - seperation, card.y, true);
						}

					}			
				}
				
				for (let i = 0; i < this.cards.length; i++) {
					let card = this.cards[i];
					card.move(originX, card.y, true);
				}
			}
		}
	}

	function loadImages(numberOfDecks = 1) {

		function loaded() {
			toLoad--;
		}

		let suits = ["Diamonds", "Clubs", "Hearts", "Spades"];
		let values = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"];

		// Bring in sprites for each card
		// Store back to flip
		// Set id to access
		let image;
		let backImage;

    let num = 0;
    let radios = document.getElementsByName("card-back"); // list of radio buttons
    let val = localStorage.getItem('card-back'); // local storage value
    for(var i=0;i<radios.length;i++){

      if(radios[i].value == val) {
        radios[i].checked = true;
        num = i;

        if(radios[i].checked == true) {
          window.localStorage.setItem('card-back', this.value);
        }; // marking the required radio as checked
 
      } else {
        radios[num].checked = true;
        if(radios[i].checked == true) {
        };
      }
    }
		
		numberOfDecks = 1;

		if (numberOfDecks == 1) {
			suits.forEach(function(suit) {
				values.forEach(function(value) {
					image = new Image(cardWidth, cardHeight);
					backImage = new Image(cardWidth, cardHeight);
					image.onload = loaded();
					backImage.onload = loaded();
					image.src = "imgs/sprites/card" + suit + value + ".png";
					
          if(!val || val == "undefined") {
            backImage.src = "imgs/sprites/cardBack.png";           
          } else {
            backImage.src = "imgs/sprites/cardBack_" + val + ".png";
          }
					
					cardImages.set(suit + value, image);
					cardImages.set(suit + value + "Back", backImage);
					cardRefs.set(suit + value, new Card(cardImages.get(suit + value), cardImages.get(suit + value + "Back"), suit, value));
				});
			});
		}
	}
	
	function changeMode(newMode) {
		switch(newMode) {

			default:
				currentMode = newMode;
				break;
		}
	}
	
	function gameMenu() {

		// Get username if none exists
		if(!username || username == "undefined") {
			$("#message").html("<div id='enterUsername'><h3>Please Enter Your Name</h3><br><input type='text' id='usernameText'><button type='button' id='usernameButton'>Submit</button></div>");
		

			$("#usernameButton").click(function() {
				let enteredName = $('#usernameText').val();
				if(enteredName == "") {
					alert("Please enter a name");
				} else {
          $(enteredName) = trim(preg_replace('/ +/', ' ', preg_replace('/[^A-Za-z0-9 ]/', ' ', urldecode(html_entity_decode(strip_tags($des))))));
					window.localStorage.setItem('user', enteredName);
					location.reload();
				}
			});

		}

		// User has name, wait for another player
		else {

			$("#message").html("<h3>Welcome, " +  username + "</h3><br><h2>Enter gameID</h2>");
			$("#message").append("<input type='text' id='gameId'><br><button type='button' id='joinGameButton'>Join Game</button>");
			$("#message").append("<h2>Or</h2><br><button type='button' id='newGameButton'>Start Game</button>");

			$("#joinGameButton").click(function() {
				let enteredId = $('#gameId').val().trim();
				socket.emit('joinGame', 'war', enteredId);
			});

			$("#newGameButton").click(function() {
				socket.emit('createGame', 'war');
			});
			
		}
		
	}

	function replayMenu() {
		$("#message").html("<h3>Would you like to play again, " +  username + "?</h3>");
		$("#message").append("<button type='button' id='playAnotherButton'>Play another</button>");

		$("#playAnotherButton").click(function() {
			playersBattleCards.cards = [];
			playersDeck.cards = [];
			playersDiscard.cards = [];
			changeMode("wait");
			socket.emit("replay");
			$("#message").html("Waiting for other player...");
		});
	}


	// Reset mouse offsets on resize
	$( window ).resize(function(){
		playArea.setOffsets();
	})

	$('#gameMode').click(function() {
		window.localStorage.setItem("warMode", "singlePlayer");
		window.location.href = "war.html";
	});

	// Global vars
	var cardImages = new Map();
	var cardRefs = new Map();
	var currentMode = "wait";

	var cardWidth = 140 * 0.7;
	var cardHeight = 190 * 0.7;
	var player1Bottom = 100
	var player2Top = 100
	var playArea = new PlayArea(900, 600);
	var mainDeck = new CardCollection(playArea.width / 2, playArea.height / 2);
	var player1Deck = new CardCollection(cardWidth, playArea.height - player1Bottom);
	var player2Deck = new CardCollection(cardWidth, player2Top);
	var player1Discard = new CardCollection(cardWidth + 150, playArea.height - player1Bottom);
	var player2Discard = new CardCollection(cardWidth + 150, player2Top);
	var player1BattleCards = new CardCollection(playArea.width / 2 - 50, playArea.height / 2, -20, 0);
	var player2BattleCards = new CardCollection(playArea.width / 2 +  50, playArea.height / 2, 20, 0);
	var playersDeck;
	var playersDiscard;
	var playersBattleCards;
	var animationPlaying = false;
	var playerWait = false;

	var toLoad = 104;
	var highestZ = 0;

	var playerNumber;
	
	
	loadImages();
	
	var loadingInterval = setInterval(function() {
		if (!toLoad) {
			clearInterval(loadingInterval);
			gameMenu();
		}
	}, 1);

	$("#back-btn").click(function(){
		let val = localStorage.getItem('card-back');
		cardRefs.forEach(card => {
		  if(val == "undefined") {
			card.backImage.src = "imgs/sprites/cardBack.png";           
		  } else {
			card.backImage.src = "imgs/sprites/cardBack_" + val + ".png";
		  }
		});
	  });

  
	$(".card").click(function() {
		
		let card = cardRefs.get(this.id);
		
		switch(currentMode) {
				
			case("play"): 
				
				if(card == playersDeck.getLastCard()) {
					
					socket.emit("layCard", playerNumber);
				}
				break;
				
			case("collect"):
				if(card == playersBattleCards.getLastCard()) {
					socket.emit("collect", playerNumber);	
				}
				break;
				
				
			case("restart"):
				window.location.reload();
				break;
		}
		
	});
	
	playArea.$selector.mousemove(function(e) {
		let mouseX = e.pageX - playArea.xOffset;
		let mouseY = e.pageY - playArea.yOffset;
		let card;
		
		switch(currentMode) {
				
			case("play"):
				
				if (playersDeck.hasCards()){
					card = playersDeck.getLastCard();
				
					if (Math.abs(mouseX - card.x) <= cardWidth / 2 && Math.abs(mouseY - card.y) <= cardHeight / 2 &&
						!(playerWait || animationPlaying)) {
						card.$selector.css({"outline": "3px solid red"});
					} else {
						card.$selector.css({"outline": "none"});
					}
				}
				
				break;
				
			case("collect"):
				if (playersBattleCards.hasCards()) {
					card = playersBattleCards.getLastCard();
				
					if (Math.abs(mouseX - card.x) <= cardWidth / 2 && Math.abs(mouseY - card.y) <= cardHeight / 2 &&
						!(playerWait || animationPlaying)) {
						
						card.$selector.css({"outline": "3px solid red"});
					} else {
						card.$selector.css({"outline": "none"});
					}
				}
				
				break;
		}

	});

});



