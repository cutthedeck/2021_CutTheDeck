

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
		this.suitValue;
		this.face = face;
		this.width = this.image.width;
		this.height = this.image.height;
		this.x = playArea.width / 2;
		this.y = playArea.height / 2;
		this.id = suit + face;
		this.faceUp = true;
		this.clickable = true;
		this.value;
		this.oldCollection;
		
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
					this.value = 1;
					break;
				default:
					this.value = 0;
					break;
			}
		}
		
		switch(suit) {
			// "Diamonds", "Clubs", "Hearts", "Spades"
			case "Diamonds":
				this.suitValue = 1;
				break;
			case "Clubs":
				this.suitValue = 2;
				break;
			case "Hearts":
				this.suitValue = 3;
				break;
			case "Spades":
				this.suitValue = 4;
				break;
			default:
				this.suitValue = 0;
				break;
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
			this.$selector.animate({left: x - this.width / 2, top: y - this.height / 2}, 200);
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
			
			if (this.cards.length) {
				if (index == -1) {
					removed = this.cards.pop();
				} else {
					removed = this.cards.splice(index, 1)[0];
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
		
		moveCollection(x, y) {
			this.x = x;
			this.y = y;
			for(let i = 0; i < this.cards.length; i++) {
				this.cards[i].move(this.x + i * this.stagerX, this.y + i * this.stagerY, false);
			}
			
//			let self = this;
//			this.cards.forEach(function(card) {
//				card.move(self.x, self.y, false);
//			});
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
		
		numberOfDecks = 1;

		if (numberOfDecks == 1) {
			suits.forEach(function(suit) {
				values.forEach(function(value) {
					image = new Image(cardWidth, cardHeight);
					backImage = new Image(cardWidth, cardHeight);
					image.onload = loaded();
					backImage.onload = loaded();
					image.src = "imgs/sprites/card" + suit + value + ".png";
					backImage.src = "imgs/sprites/cardBack.png";
					
					cardImages.set(suit + value, image);
					cardImages.set(suit + value + "Back", backImage);
					cardRefs.set(suit + value, new Card(cardImages.get(suit + value), cardImages.get(suit + value + "Back"), suit, value));
				});
			});
			
			// Background outlines for solitaire
			
			// Piles
			for (let i = 0; i < 7; i++) {
				image = new Image(cardWidth, cardHeight);
				backImage = new Image(cardWidth, cardHeight);
				image.onload = loaded();
				backImage.onload = loaded();
				image.src = "imgs/sprites/cardBorderBlack.png";
				backImage.src = "imgs/sprites/cardBorderBlack.png";
				cardImages.set("CardBorder" + "Pile" + i,image);
				cardRefs.set("CardBorder" + "Pile" + i, new Card(cardImages.get("CardBorder" + "Pile" + i), cardImages.get("CardBorder" + "Pile" + i), "Border", "Pile" + i));
			}
			
			// Stacks
			for (let i = 0; i < 4; i++) {
				image = new Image(cardWidth, cardHeight);
				backImage = new Image(cardWidth, cardHeight);
				image.onload = loaded();
				backImage.onload = loaded();
				image.src = "imgs/sprites/cardBorderBlack.png";
				backImage.src = "imgs/sprites/cardBorderBlack.png";
				cardImages.set("CardBorder" + "Stack" + i,image);
				cardRefs.set("CardBorder" + "Stack" + i, new Card(cardImages.get("CardBorder" + "Stack" + i), cardImages.get("CardBorder" + "Stack" + i), "Border", "Stack" + i));
			}
			
			// LeftOver / Draw pile
			image = new Image(cardWidth, cardHeight);
			backImage = new Image(cardWidth, cardHeight);
			image.onload = loaded();
			backImage.onload = loaded();
			image.src = "imgs/sprites/cardBorderBlack.png";
			backImage.src = "imgs/sprites/cardBorderBlack.png";
			cardImages.set("CardBorderLeftOver",image);
			cardRefs.set("CardBorderLeftOver", new Card(cardImages.get("CardBorderLeftOver"), cardImages.get("CardBorderLeftOver"), "Border", 0));
		}
	}
	
	function moveCards(numberOfCards, fromCollection, toCollections, reverse = false) {
		
		// Check if array and if not, put into one
		// This allows passing of either array of collections
		// or a single collection
		if(!Array.isArray(toCollections)) {
			toCollections = [toCollections];
		}

		let numberOfCollections = toCollections.length;
		let fromLength = fromCollection.cards.length;
			
		if (reverse) {
			
			// Removing changes index so it must be kept
			// the same
			let removeIndex = fromLength - numberOfCards;
			for(var i = removeIndex; i < fromLength; i++) {
				console.log(fromCollection);
				card = fromCollection.removeCard(removeIndex);
				card.clickable = false;
				toCollections[i%numberOfCollections].addCard(card);
				card.$selector.css({zIndex: highestZ});
				highestZ += 1
			}
		} else {
			for(var i = 0; i < numberOfCards; i++) {
				card = fromCollection.removeCard();
				card.clickable = false;
				toCollections[i % numberOfCollections].addCard(card);
				card.$selector.css({zIndex: highestZ});
				highestZ += 1
			}
		}
	}
	
	function checkLoss() {
	
	}
	
	function changeMode(newMode) {
		switch(newMode) {
			case "play":
				
				// Deal to the piles
				for (let row = 0; row < 7; row++) {
					for (let col = row; col < 7; col++) {
						moveCards(1, mainDeck, piles[col]);
						if (col == row) {
							piles[col].getLastCard().flipUp();
						}
					}
				}
				
				// Move leftovers
				moveCards(mainDeck.cards.length, mainDeck, leftOver);
				
				// Set up stacks
				for (let i = 0; i < 4; i++) {
					stacks[i].addCard(cardRefs.get("CardBorderStack" + i));
					stacks[i].getLastCard().show();
				}
				
				
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
	
	function nextInCollection(collection) {
		if (collection.hasCards()) {
			collection.getLastCard().flipUp();
		}
	}
	
	function checkPile(i) {
		
		// Check for empty and previously empty
		let collection = piles[i];
		if (!collection.cards.length) {
			collection.addCard(cardRefs.get("CardBorderPile" + i));
		} else if (collection.getLastCard().suit == "Border") {
			collection.pop();
		}
	}

	function playGame() {

		// Grab the main deck
		cardRefs.forEach(card => {
			if(card.suit != "Border") {
				card.show();
				card.$selector.css({zIndex: highestZ});
				highestZ += 1;
				mainDeck.addCard(card);
			}
			
		});

		$(".card").click(function() {
			let card = cardRefs.get(this.id);
			
			switch(currentMode) {
					
				case("deal"):
					if (currentMode == "deal") {
						mainDeck.shuffle();
						changeMode("play");
						$('#message').hide();
					}
					
				case("play"): 
					
					break;
					
				case("collect"):
					
					break;
					
					
				case("restart"):
					window.location.reload();
					break;
			}		
			
		});
		
		playArea.$selector.mousedown(function(e) {
			e.preventDefault();
			let foundCard = false;
			let card;
			
			// Check piles to see if they were clicked
			let i = 0;
			let j;
			while (!foundCard && i < 7) {
				if (piles[i].cards.length && piles[i].getLastCard().suit != "Border") {
					// face ups are dragable
					
					j = piles[i].cards.length - 1;
					
					// Move backward through pile to see where was clicked
					while(!foundCard && j >= 0) {
						card = piles[i].cards[j];
						
						if (Math.abs(mouseX - card.x) <= cardWidth / 2 && Math.abs(mouseY - card.y) <= cardHeight / 2 &&
							 card.faceUp) {
							card.oldCollection = piles[i];
							foundCard = true;
						}
						
						j--;
					}

				}
				
				i++;
			}
			
			if (foundCard) {
				// Reset last inc/dec
				i--;
				j++;
				
				// Adjust for where card was found
				moveCards(piles[i].cards.length - j, piles[i], drag, true);
				checkPile(i);
			}
			
			// Play from drawn cards
			if (discard.hasCards()) {
				card = discard.getLastCard();
				
				if (!foundCard && Math.abs(mouseX - card.x) <= cardWidth / 2 && Math.abs(mouseY - card.y) <= cardHeight / 2) {
					moveCards(1, discard, drag);
					card.oldCollection = discard;
					foundCard = true;
				}
			}
			
			
			// Draw card
			if (leftOver.hasCards()) {
				card = leftOver.getLastCard();
				
				if (Math.abs(mouseX - card.x) <= cardWidth / 2 && Math.abs(mouseY - card.y) <= cardHeight / 2) {
					
					// Card there
					if (card.suit != "Border") {
						moveCards(1, leftOver, discard);
						card.flipUp();
						
						// Check if last card
						if (!leftOver.hasCards()) {
							console.log("Drawn out");
							leftOver.addCard(cardRefs.get("CardBorderLeftOver"));
							leftOver.getLastCard().flipUp();
							console.log(leftOver);
						}

					} else {
						// Only border there try and reshuffle
						discard.cards.forEach(function(card) {
							card.flipDown();
						})
						moveCards(discard.cards.length, discard, leftOver);
					}

				}

			}
			
//			if (leftOver.hasCards()) {
//				card = leftOver.getLastCard();
//				if (!foundCard && Math.abs(mouseX - card.x) <= cardWidth / 2 && Math.abs(mouseY - card.y) <= cardHeight / 2) {
//					moveCards(1, leftOver, discard);
//					card.flipUp();
//				}
//			}
			

		});
		
		playArea.$selector.mouseup(function(e) {
			
			if(drag.hasCards()) {
				
				let foundSpot = false;
				let i = 0;
				let dragCard = drag.cards[0];
				
				// Check piles
				while (!foundSpot && i < 7) {
					if (piles[i].cards.length) {
						let card = piles[i].getLastCard();
						
						// Drop if on a pile with appropriate card
						if (Math.abs(mouseX - card.x) <= cardWidth / 2 && Math.abs(mouseY - card.y) <= cardHeight / 2) {
							
							if(dragCard.value + 1 == card.value && dragCard.suitValue % 2 != card.suitValue % 2) {
								moveCards(drag.cards.length, drag, piles[i], true);
								nextInCollection(dragCard.oldCollection);
								foundSpot = true;
							}
							// Play kinds in open spaces
							else if(dragCard.value == 13 && card.suit == "Border") {
								piles[i].cards.pop();
								moveCards(drag.cards.length, drag, piles[i], true);
								nextInCollection(dragCard.oldCollection);
								foundSpot = true;
							}
							
						}
					}
					i++;
				}
				
				i = 0
				// Check stacks
				while (!foundSpot && i < 4) {
					card = stacks[i];
					if (Math.abs(mouseX - card.x) <= cardWidth / 2 && Math.abs(mouseY - card.y) <= cardHeight / 2) {
						let card = stacks[i].getLastCard()
						// Pile blank add ace
						if (card.suit == "Border" && dragCard.value == 1) {
							stacks[i].cards.pop();
							moveCards(1, drag, stacks[i]);
							nextInCollection(dragCard.oldCollection);
							foundSpot = true;
						}
						
						// Pile has cards add next of same suit
						else if (card.suit == dragCard.suit && card.value + 1 == dragCard.value) {
							moveCards(1, drag, stacks[i]);
							nextInCollection(dragCard.oldCollection);
							foundSpot = true;
						}
					}
					
					i++
				}
				
				if (!foundSpot) {
					moveCards(drag.cards.length, drag, dragCard.oldCollection, true);
				}
				
			}
			
		});
		
		playArea.$selector.mousemove(function(e) {
			mouseX = e.pageX - playArea.xOffset;
			mouseY = e.pageY - playArea.yOffset;
			drag.moveCollection(mouseX, mouseY);
			
//			let mouseX = e.pageX - playArea.xOffset;
//			let mouseY = e.pageY - playArea.yOffset;
//			let card;
//			
//			// TODO: Make more efficient
//			switch(currentMode) {
//					
//				case("deal"):
//					
//					if (mainDeck.hasCards()){
//						card = mainDeck.getLastCard();
//				
//						if (Math.abs(mouseX - card.x) <= cardWidth / 2 && Math.abs(mouseY - card.y) <= cardHeight / 2) {
//							card.$selector.css({"outline": "3px solid red"});
//						} else {
//							card.$selector.css({"outline": "none"});
//						}
//						
//					}
//					
//					break;
//					
//				case("play"):
//					
//					if (player1Deck.hasCards()){
//						card = player1Deck.getLastCard();
//					
//						if (Math.abs(mouseX - card.x) <= cardWidth / 2 && Math.abs(mouseY - card.y) <= cardHeight / 2) {
//							card.$selector.css({"outline": "3px solid red"});
//						} else {
//							card.$selector.css({"outline": "none"});
//						}
//					}
//					
//					break;
//					
//				case("collect"):
//					if (player1BattleCards.hasCards()) {
//						card = player1BattleCards.getLastCard();
//					
//						if (Math.abs(mouseX - card.x) <= cardWidth / 2 && Math.abs(mouseY - card.y) <= cardHeight / 2) {
//							
//							card.$selector.css({"outline": "3px solid red"});
//						} else {
//							card.$selector.css({"outline": "none"});
//						}
//					}
//					
//					break;
//			}

		});
		
		
	}

	// Global vars
	var cardImages = new Map();
	var cardRefs = new Map();
	var currentMode = "deal";

	var cardWidth = 140 * 0.7;
	var cardHeight = 190 * 0.7;
	var player1Bottom = 100
	var player2Top = 65
	var playArea = new PlayArea(900, 700);
	var mainDeck = new CardCollection(playArea.width / 2, playArea.height / 2);
	var leftOver = new CardCollection(80, 100);
	var discard = new CardCollection(220, 100, 0, 0);
	var drag = new CardCollection(0, 0, 0, 20);
	var mouseX;
	var mouseY;
	
	// Populate 7 piles
	var piles = [];
	for(let i = 1; i <= 7; i++) {
		setTimeout(function() {
			piles.push(new CardCollection(120 * i - 30, playArea.height / 2 - 120, 0, 25));
		}, 600);
		
	}
	
	// Populate card stacks
	var stacks = [];
	for(let i = 1; i <= 4; i ++) {
			stacks.push(new CardCollection(playArea.width / 2 - 60 + 110 * i, 100, 0, 0))
			}
	
	
	var animationPlaying = false;

	var toLoad = 128;
	var highestZ = 0;
	
	
	loadImages();
	
	var loadingInterval = setInterval(function() {
		if (!toLoad) {
			clearInterval(loadingInterval);
			playGame();
		}
	}, 1);

});


