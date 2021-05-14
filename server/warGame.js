module.exports = {
    initGame
}

class Card {
	constructor(suit, face) {
		this.suit = suit;
		this.face = face;
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
	}
	
	show() {
		this.flip();
	}
	
	
	flipUp() {
		if (true || !this.faceUp) {
			this.faceUp = true;
		}
	}
	
	flipDown() {
		if (true || this.faceUp) {
			this.faceUp = false;
		}
	}
	
	flip() {
		if (this.faceUp) {
			this.flipDown();
		} else {
			this.flipUp();
		}
	}
}

class CardCollection {
    constructor(  cards = []) {
        this.cards = cards;
    }
    
    addCard(card) {
        this.cards.push(card);
    }
    
    removeCard() {
        return this.cards.pop();
    }
    
    getLastCard() {
        return this.cards[this.cards.length - 1];
    }
    
    hasCards() {
        return this.cards.length > 0;
    }
    
    shuffle() {

        // Populate each position with a card selecteded from
        // that position or less (Fischer - Yates)
        for (let i = this.cards.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));

            var cardA = this.cards[i];
            var cardB = this.cards[j];
            this.cards[i] = cardB;
            this.cards[j] = cardA;
        }

    }
}

function shuffle(cardCollection) {
    let cards = cardCollection.cards;
    for (let i = cards.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));

        let tempCard = cards[i];
        this.cards[i] = cards[j];
        this.cards[j] = tempCard;
    }

    return cardCollection;
}


function populateCardRefs() {
    let cardRefs = new Map();
    //let suits = ["Diamonds", "Clubs"];
	//let values = ["A", 2, 3];
    let suits = ["Diamonds", "Clubs", "Hearts", "Spades"];
	let values = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"];

    suits.forEach(function(suit) {
        values.forEach(function(value) {
            cardRefs.set(suit + value, new Card(suit, value));
        });
    });

    return cardRefs;
}

function initGame() {

    state = new Map();
    state.set("cardRefs", populateCardRefs());
    state.set("mainDeck", new CardCollection());
    state.set("player1Deck", new CardCollection());
    state.set("player2Deck", new CardCollection());
    state.set("player1Discard", new CardCollection());
    state.set("player2Discard", new CardCollection());
    state.set("player1BattleCards", new CardCollection());
    state.set("player2BattleCards", new CardCollection());
    state.set("player1Compare", false);
    state.set("player2Compare", false);
    state.set("replay", false);

    return state;

}