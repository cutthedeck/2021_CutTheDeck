
class PlayArea {
	constructor(canvas, defaultOffsetX = 0.3, defaultOffsetY = -0.3) {
		this.canvas = canvas;
		this.ctx = this.canvas.getContext("2d");
		this.ctx.font = ("30px Lucida Console");
		this.setRect();
		this.defaultOffsetX = defaultOffsetX;
		this.defaultOffsetY = defaultOffsetY;
	}
	
	setRect() {
		this.rect = this.canvas.getBoundingClientRect();
	}
	
	buildScreen() {
		this.ctx.fillStyle = "#071";
		this.ctx.fillRect(0, 0, playArea.canvas.width, playArea.canvas.height);
	
		// Draw drawables
		drawables.forEach(function(drawable) {
			drawable.forEach(function(item) {
				item.drawToCanvas();
			});
			//drawable.drawToCanvas();
		});
	}
	
	drawText(string) {
		this.ctx.fillStyle = "#000";
		this.ctx.fillText(string, 30, 30);
	}
	
	
}

class Card {
	constructor(x, y, faceNumber = 1, suitNumber = 0, faceUp = false) {
		this.faceUp = faceUp;
		// Keep numbers for comparison purposes
		this.faceNumber = faceNumber;
		this.suitNumber = suitNumber;
		
		
		// Set face name and suit name in order to build image name
		if (faceNumber > 1 && faceNumber < 11) {
			this.faceName = faceNumber;
		} else {
			switch (faceNumber) {
				case 1:
					this.faceName = "A";
					break;
				case 11:
					this.faceName = "J";
					break;
				case 12:
					this.faceName = "Q";
					break;
				case 13:
					this.faceName = "K";
					break;
			}
		}
		
		switch (suitNumber) {
			case 1:
				this.suitName = "Diamonds";
				break;
			case 2:
				this.suitName = "Clubs";
				break;
			case 3:
				this.suitName = "Hearts";
				break;
			case 4:
				this.suitName = "Spades";
				break;
		}
		
		if (aceHigh && this.faceNumber == 1) {
			this.faceNumber = 14;	
		}
		
		// Images for card
		this.sprite = cardImages.get(this.suitName + this.faceName);
		this.back = cardImages.get("Back");
		
		this.left = x;
		this.right = x + this.sprite.width;
		this.top = y;
		this.bottom = y + this.sprite.height;
		
		}
	
	// Draw to the canvas
	drawToCanvas() {
		if (this.faceUp) {
			playArea.ctx.drawImage(this.sprite, this.left, this.top, cardWidth, cardHeight);
		} else {
			playArea.ctx.drawImage(this.back, this.left, this.top, cardWidth, cardHeight);
		}
		
	}
	
	moveCard(x, y) {
		// TODO: add animation for this movement
		
		this.left = x;
		this.right = x + this.sprite.width;
		this.top = y;
		this.bottom = y + this.sprite.height;
	}
}

class CardCollection {
	constructor(x = 0, y = 0, offsetX = playArea.defaultOffsetX, offsetY = playArea.defaultOffsetY, cards = []) {
		this.cards = cards;
		this.x = x;
		this.y = y;
		this.offsetX = offsetX;
		this.offsetY = offsetY;
		drawables.push(this.cards);
	}
	
	getCard(index = -1) {
		if (index == -1) {
			return this.cards[this.cards.length - 1];
		} else {
			return this.cards[index];
		}
		
	}
	
	shuffle() {
		
		// Populate each spot in the array with a random selection
		// from the remaining values in the array (Fisher-Yates)
		var i, j;
		var x = this.cards[0].left;
		var y = this.cards[0].top;
		
		for (i = this.cards.length - 1; i > 0; i--) {
			//break;
			j = Math.floor(Math.random() * (i + 1));
			
			var cardA = this.cards[i];
			var cardB = this.cards[j];
			this.cards[i] = cardB;
			this.cards[j] = cardA;
			
			// Adjust for display purposes stager on
			// basis of position in deck
			this.cards[i].moveCard(x + this.offsetX * i, y + playArea.defaultOffsetY * i);
		}
	}
	
	drawCard(flip = true) {
		var drawn = this.cards[this.cards.length - 1];
		this.cards.splice(this.cards.length - 1, 1);
		
		if (flip) {
			drawn.faceUp = !drawn.faceUp;
		}
		return drawn;
	}
	
	addCard(card) {
		var deckSize = this.cards.length;
		this.cards.push(card);
		card.moveCard(this.x + deckSize * this.offsetX, this.y + deckSize * this.offsetY);
	}
	
	addFullDecks(numberOfDecks = 1) {
		var offSet = 0
		
		for (var d = 0; d < numberOfDecks; d++) {
			for (var s = 1; s < 5; s++) {
				for (var f = 1; f < 14; f++) {
					var deckLength = this.cards.length;
					this.cards.push(new Card(deckLength * this.offsetX, deckLength * this.offsetY, f, s));
					//drawables.push(this.cards[this.cards.length - 1]);
					//offSet += playArea.deckOffset;
				}
			}
		}
	}
	
	// Positions are passed in with a 2d array 
	// [[pos0 x, pos0, y], [pos1 x, pos1 y]...]
	splitDeck(positions, numberOfWays = 2) {
		var hands = [];
		
		// Add card collection for each portion it's split in
		for (i = 0; i < numberOfWays; i++) {
			hands.push(new CardCollection(positions[i][0], positions[i][1]));
		}
		
		// Go through deck and add it to correct collection
		// then move them to the proper position
		for (var i = 0; i < this.cards.length; i ++) {
			var currentHand = hands[i % numberOfWays];
			var currentHandSize = currentHand.cards.length;
			var currentCard = this.cards[i];
			currentHand.cards.push(currentCard);
			
			// Move card to proper position
			currentCard.moveCard(currentHand.x + currentHandSize * playArea.defaultOffsetX, currentHand.y + currentHandSize * playArea.defaultOffsetY);
		}
		
		// Empty deck so cards aren't in two places
		// at once.
		this.cards = [];
		
		return hands;
	}
}

// Globals for loading assets, accessing canvas
// and drawing assets
var cardWidth = 140 * 0.7;
var cardHeight = 190 * 0.7;
var aceHigh = true;
var cardImages = preloadCardImages("sprites/card");
var imagesLoaded = false;
var playArea  = new PlayArea(document.getElementById("myCanvas"));
var drawables = [];
		
function main() {
	
	
	var cardImages = preloadCardImages("sprites/card");
	
	// Loading loop
	var loadingInterval = setInterval(function() {
		if (imagesLoaded) {
			clearInterval(loadingInterval);
			playGame();
		}
	}, 100);

}

function playGame() {
	
	// Inner function to reset play variables at new game
	function resetGame() {
		
		drawables = [];
		
		deck = new CardCollection();
		player1Discard = new CardCollection(220, player1Top);
		player2Discard = new CardCollection(220, 20);
		player1WarCards = new CardCollection(canvasWidth - cardWidth - 5, canvasHeight / 2 + 30, 0, smallGap);
		player2WarCards =  new CardCollection(canvasWidth - cardWidth - 5, canvasHeight / 2 - (30 + cardHeight), 0, -smallGap);

		deck.addFullDecks();
		deck.shuffle();

		hands = deck.splitDeck([[20,player1Top], [20,20]]);
		
		player1Deck = hands[0];
		player2Deck = hands[1];
		
		player1Win = false;
		player2Win = false;
	}
	
	var bigGap = 25;
	var smallGap = 12;
	
	var canvasHeight = playArea.canvas.height;
	var canvasWidth = playArea.canvas.width;
	var player1Top = canvasHeight - (20 + cardHeight);
	
	var player1Win = false;
	var player2Win = false;
	
	var deck = new CardCollection();
	var player1Discard = new CardCollection(220, player1Top);
	var player2Discard = new CardCollection(220, 20);
	var player1WarCards = new CardCollection(canvasWidth - cardWidth - 5, canvasHeight / 2 + 30, 0, smallGap);
	var player2WarCards =  new CardCollection(canvasWidth - cardWidth - 5, canvasHeight / 2 - (30 + cardHeight), 0, -smallGap);
	
	deck.addFullDecks();
	deck.shuffle();
	
	var hands = deck.splitDeck([[20,player1Top], [20,20]]);
	var player1Deck = hands[0];
	var player2Deck = hands[1];
	
	//setUpGame();

	playArea.buildScreen();

	
	$(playArea.canvas).mousedown(function(e) {
		
		// Reset game if it's over
		if (player1Win || player2Win) {
			resetGame();
			playArea.buildScreen();
		}
		else {
		
			var player1CanDraw = checkIfCanDraw(player1Deck, player1Discard);
			var player2CanDraw = checkIfCanDraw(player2Deck, player2Discard);

			// No cards in play
			if (!player1WarCards.cards.length) {
				if (!player1CanDraw) {
					player2Win = true;
				} else if (!player2CanDraw) {
					player1Win = true;
				} else {
					player1WarCards.offsetY = bigGap;
					player2WarCards.offsetY = -bigGap;
					moveCardFromCollection(player1Deck, player1WarCards);
					moveCardFromCollection(player2Deck, player2WarCards);
				}

			}
			// Cards in play
			else {

				var player1Card = player1WarCards.getCard();
				var player2Card = player2WarCards.getCard();

				// Cards are battling
				if (player1Card.faceUp && player2Card.faceUp) {
					var winnerDiscard = null;


					// Player 1 wins battle
					if (player1Card.faceNumber > player2Card.faceNumber) {
						winnerDiscard = player1Discard;
					}
					// Player 2 wins battle
					else if (player2Card.faceNumber > player1Card.faceNumber) {
						winnerDiscard = player2Discard;
					}
					// Tie
					else {
						// Both players out of cards
						if (!(player1CanDraw || player2CanDraw)) {
							player1Win = true;
							player2Win = true;
						}
						// Player 1 can't play
						else if(!player1CanDraw) {
							player1Win = true;
						}
						// Player 2 can't play
						else if(!player2CanDraw) {
							player2Win = true;
						}
						// Both can play
						else {
							var player1Flip = false;
							var player2Flip = false;
							
							if ((player1Deck.cards.length + player1Discard.cards.length == 1) || 
									!(player1WarCards.cards.length % 4)) {
								player1Flip = true;
							}

							if ((player2Deck.cards.length + player2Discard.cards.length == 1) || 
									!(player2WarCards.cards.length % 4)) {
								player2Flip = true;
							}
							
							moveCardFromCollection(player1Deck, player1WarCards, player1Flip);
							moveCardFromCollection(player2Deck, player2WarCards, player2Flip);
						}


					}


					// Move to discard if appropriate
					if (winnerDiscard) {
						var flip = true;
						while (player1WarCards.cards.length) {
							if (player1WarCards.getCard().faceUp) {
								flip = false;
							} else {
								flip = true;
							}

							moveCardFromCollection(player1WarCards, winnerDiscard, flip);
						}

						while (player2WarCards.cards.length) {
							if (player2WarCards.getCard().faceUp) {
								flip = false;
							} else {
								flip = true;
							}

							moveCardFromCollection(player2WarCards, winnerDiscard, flip);
						}

					}
				} 
				// Cards arent battling
				else {

					var player1Flip = false;
					var player2Flip = false;

					console.log("Player 1 had " + (player1Deck.cards.length + player1Discard.cards.length));
					console.log("Player 2 had " + (player2Deck.cards.length + player2Discard.cards.length));
					// Check each player for last card
					// or 3 buried or first card
					if ((player1Deck.cards.length + player1Discard.cards.length == 1) || 
							!(player1WarCards.cards.length % 4)) {
						player1Flip = true;
					}

					if ((player2Deck.cards.length + player2Discard.cards.length == 1) || 
							!(player2WarCards.cards.length % 4)) {
						player2Flip = true;
					}

					if (player1CanDraw) {
						moveCardFromCollection(player1Deck, player1WarCards, player1Flip);
					}
					if (player2CanDraw) {
						moveCardFromCollection(player2Deck, player2WarCards, player2Flip);
					}



				}

			}


			playArea.buildScreen();

			// Check for win and display message
			if (player1Win) {
				if (player2Win) {
					playArea.drawText("It's a tie!");
				} else {
					playArea.drawText("You win!");
				}

			} else if(player2Win) {
				playArea.drawText("You lose!");
			}
		}

	});

}

function moveCardFromCollection(collection1, collection2, flip = true) {
	card = collection1.drawCard(flip);
	collection2.addCard(card);
}


function preloadCardImages(filepath) {
	var cardImages = new Map();
	var suits = ["Diamonds", "Clubs", "Hearts", "Spades"];
	var values = ["A", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"];
	var toLoad = 54;
	var image;
	imagesLoaded = false;
	
	// Cycle through and construct images w/ file paths
	suits.forEach(function(suit) {
		values.forEach(function(value) {
			image = new Image();
			
			image.onload = function() {
				toLoad--;
				// Change global flag for image loading
				if (toLoad == 0) {
					imagesLoaded = true;
				}
			}
			
			image.src = filepath + suit + value + ".png";

			cardImages.set(suit + value, image);
		})
	})
	
	// Load the back image and the joker
	image = new Image();
			
	image.onload = function() {
		toLoad--;
		// Change global flag for image loading
		if (toLoad == 0) {
			imagesLoaded = true;
		}
	}

	image.src = filepath + "Back" + ".png";
	cardImages.set("Back", image);
	
	image = new Image();
			
	image.onload = function() {
		toLoad--;
		// Change global flag for image loading
		if (toLoad == 0) {
			imagesLoaded = true;
		}
	}

	image.src = filepath + "Joker" + ".png";
	cardImages.set("Joker", image);
	
	return cardImages;
}

function checkIfCanDraw(collection1, collection2) {
	if (collection1.cards.length) {
		return true;
	} else if (collection2.cards.length) {
		
		while(collection2.cards.length) {
			moveCardFromCollection(collection2, collection1);
		}
		
		collection1.shuffle();
		return true;
	} else {
		return false;
	}
}

main()