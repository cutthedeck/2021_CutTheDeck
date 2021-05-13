$(function() {
	
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
	
	show() {
		// Fix me
		//this.faceUp = !this.faceUp;
		this.flip();
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
				console.log("Animating ", animationPlaying);
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
			card.$selector.css({"outline": "none"});
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
			
			// Populate each position with a card selecteded from
			// that position or less (Fischer - Yates)
			for (let i = this.cards.length - 1; i > 0; i--) {
				let j = Math.floor(Math.random() * (i + 1));

				var cardA = this.cards[i];
				var cardB = this.cards[j];
				this.cards[i] = cardB;
				this.cards[j] = cardA;
			}

			// Make sure cards are arranged in proper display order
			for (let i = 0; i < this.cards.length; i++) {
				this.cards[i].move(this.x + this.stagerX * i, this.y + this.stagerY * i, false);
				this.cards[i].$selector.css({zIndex: highestZ});
				highestZ += 1;
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
	
	function moveCards(numberOfCards, fromCollection, toCollections) {
		
		// Check if array and if not, put into one
		// This allows passing of either array of collections
		// or a single collection
		if(!Array.isArray(toCollections)) {
			toCollections = [toCollections];
		}
		
		let numberOfCollections = toCollections.length;
		
			for(var i = numberOfCards - 1; i >= 0; i--) {
				card = fromCollection.removeCard();
				card.clickable = false;
				toCollections[i%numberOfCollections].addCard(card);
				card.$selector.css({zIndex: highestZ});
				highestZ += 1
			}
		
		
	}
	
	function checkLoss() {
		
		if (player1Deck.cards.length + player1Discard.cards.length == 0) {
			if (player2Deck.cards.length + player2Discard.cards.length == 0) {
				$("#message").html("It's a tie! \n Click a card to play again!");
				$("#message").show();
				changeMode("restart");
			} else {
				$("#message").html("You lose! \n Click a card to play again!");
				$("#message").show();
				saveResult(false, "war");
				changeMode("restart");
			}
		} else if (player2Deck.cards.length + player2Deck.cards.length == 0) {
			$("#message").html("You win! \n Click a card to play again!");
			$("#message").show();
			saveResult(true, "war");
			changeMode("restart");
		}
	}
	
	function changeMode(newMode) {
		switch(newMode) {
			case "play":
				
				currentMode = "play"
				
				break;
			case "collect":
				currentMode = "collect";
				let player1Loss = false;
				let player2loss = false;
				
				if (player1Deck.cards.length == 0) {

					if (player1Discard.cards.length) {
						moveCards(player1Discard.cards.length, player1Discard, player1Deck);
						player1Deck.cards.forEach(card => {
							card.flipDown();
						});
						player1Deck.shuffle();
					}
				}
				
				if (player2Deck.cards.length == 0) {
					if (player2Discard.cards.length) {
						moveCards(player2Discard.cards.length, player2Discard, player2Deck);
						player2Deck.cards.forEach(card => {
							card.flipDown();
						});
						player2Deck.shuffle();
					}
				}
			
			default:
				currentMode = newMode;
				break;
		}
	}


	function playGame() {

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
    
		cardRefs.forEach(card => {
			card.show();
			card.$selector.css({zIndex: highestZ});
			highestZ += 1;
			mainDeck.addCard(card);
		});
		
		mainDeck.getLastCard().clickable = true;
		

		$(".card").click(function() {
			if (animationPlaying || playerWait) {
				return;
			}
			
			let card = cardRefs.get(this.id);
			
			switch(currentMode) {
					
				case("deal"):
					if (currentMode == "deal") {
						mainDeck.shuffle();
						moveCards(mainDeck.cards.length, mainDeck, [player1Deck, player2Deck]);
						changeMode("play");
						$('#message').hide();
					}
					
				case("play"): 
					
					if(card == player1Deck.getLastCard()) {
						
						// Set stagger to show face up cards
						if(!player1BattleCards.hasCards() || player1BattleCards.getLastCard().faceUp) {
							player1BattleCards.stagerX = -20;
							player2BattleCards.stagerX = 20;
						} else {
							player1BattleCards.stagerX = -20;
							player2BattleCards.stagerX = 20;
						}
						
						let player2Card = player2Deck.getLastCard();
						moveCards(1, player1Deck, player1BattleCards);
						moveCards(1, player2Deck, player2BattleCards);
						
						// Flip when appropriate or when either player on last card
						if ((player1BattleCards.cards.length - 1) % 4 == 0 || player1Deck.cards.length + player1Discard.cards.length == 0 ||
								 player2Deck.cards.length + player2Discard.cards.length == 0) {
							card.flipUp();
							player2Card.flipUp();
							
							// Compare
							if (card.value > player2Card.value) {
								changeMode("play");
								changeMode("collect");

							} else if (player2Card.value > card.value) {
								animationPlaying = true;
								playerWait = true;
								
								// Wait to move and allow clicks after
								setTimeout(function() {
									moveCards(player1BattleCards.cards.length, player1BattleCards, player2Discard);
									moveCards(player2BattleCards.cards.length, player2BattleCards, player2Discard);
									changeMode("collect");
									changeMode("play");
									playerWait = false;
								}, 800);
							} else {
								changeMode("collect");
								changeMode("play");
							}
							
						}
						
						else {
							changeMode("collect");
							changeMode("play");
						}
		
					}
					break;
					
				case("collect"):
					if(card == player1BattleCards.getLastCard()) {
						moveCards(player1BattleCards.cards.length, player1BattleCards, player1Discard);
						moveCards(player2BattleCards.cards.length, player2BattleCards, player1Discard);
						changeMode("collect");
						changeMode("play");			
					}
					break;
					
					
				case("restart"):
					window.location.reload();
					break;
			}
			
			// Check for wins and losses
			let waitInterval = setInterval(function() {
				if (!animationPlaying) {
					if (!player1BattleCards.hasCards() || !player1BattleCards.cards.length == 26 && 
					player1BattleCards.getLastCard().value == player2BattleCards.getLastCard().value ||
				 (player1BattleCards.hasCards() && player1BattleCards.getLastCard().faceUp && 
					player1BattleCards.getLastCard().value == player2BattleCards.getLastCard().value)) {
					checkLoss();
					}
					clearInterval(waitInterval);
				}
			}, 200);
			
			
		});
		
		playArea.$selector.mousemove(function(e) {
			let mouseX = e.pageX - playArea.xOffset;
			let mouseY = e.pageY - playArea.yOffset;
			let card;
			
			// TODO: Make more efficient
			switch(currentMode) {
					
				case("deal"):
					
					if (mainDeck.hasCards()){
						card = mainDeck.getLastCard();
				
						if (Math.abs(mouseX - card.x) <= cardWidth / 2 && Math.abs(mouseY - card.y) <= cardHeight / 2) {
							card.$selector.css({"outline": "3px solid red"});
						} else {
							card.$selector.css({"outline": "none"});
						}
						
					}
					
					break;
					
				case("play"):
					
					if (player1Deck.hasCards()){
						card = player1Deck.getLastCard();
					
						if (Math.abs(mouseX - card.x) <= cardWidth / 2 && Math.abs(mouseY - card.y) <= cardHeight / 2 &&
							 !(playerWait || animationPlaying)) {
							card.$selector.css({"outline": "3px solid red"});
						} else {
							card.$selector.css({"outline": "none"});
						}
					}
					
					break;
					
				case("collect"):
					if (player1BattleCards.hasCards()) {
						card = player1BattleCards.getLastCard();
					
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
		
		
	}
	
	// Reset mouse offsets on resize
	$( window ).resize(function(){
		playArea.setOffsets();
	})

	$('#gameMode').click(function() {
		window.localStorage.setItem("warMode", "multiplayer");
		window.location.href = "warOnline.html";
	});

	// Global vars
	var cardImages = new Map();
	var cardRefs = new Map();
	var $body = $("body");
	var modes = ["Deal", "Play", "Collect", "War"];
	var currentMode = "deal";

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
	var animationPlaying = false;
	var playerWait = false;

	var toLoad = 104;
	var highestZ = 0;
	
	
	loadImages();
	
	var loadingInterval = setInterval(function() {
		if (!toLoad) {
			clearInterval(loadingInterval);
			playGame();
		}
	}, 1);

});



