let hand = {"Player": {"ScoreSpan" : "#playerResult",
                       "Div" : "#player",
                       "Score" : 0},
                       "HasAce" : false,
                       "RemovedHighAce" : false,
            "Dealer": {"ScoreSpan" : "#dealerResult",
                       "Div" : "#dealer",
                       "Score" : 0},
                       "HasAce" : false,
                       "RemovedHighAce" : false,
            "Cards": ["SpadesA",
                      "Spades2",
                      "Spades3",
                      "Spades4",
                      "Spades5",
                      "Spades6",
                      "Spades7",
                      "Spades8",
                      "Spades9",
                      "Spades10",
                      "SpadesJ",
                      "SpadesQ",
                      "SpadesK",
                      "ClubsA",
                      "Clubs2",
                      "Clubs3",
                      "Clubs4",
                      "Clubs5",
                      "Clubs6",
                      "Clubs7",
                      "Clubs8",
                      "Clubs9",
                      "Clubs10",
                      "ClubsJ",
                      "ClubsQ",
                      "ClubsK",
                      "HeartsA",
                      "Hearts2",
                      "Hearts3",
                      "Hearts4",
                      "Hearts5",
                      "Hearts6",
                      "Hearts7",
                      "Hearts8",
                      "Hearts9",
                      "Hearts10",
                      "HeartsJ",
                      "HeartsQ",
                      "HeartsK",
                      "DiamondsA",
                      "Diamonds2",
                      "Diamonds3",
                      "Diamonds4",
                      "Diamonds5",
                      "Diamonds6",
                      "Diamonds7",
                      "Diamonds8",
                      "Diamonds9",
                      "Diamonds10",
                      "DiamondsJ",
                      "DiamondsQ",
                      "DiamondsK"],
            "cardsMap": {"SpadesA" : 1,
                          "Spades2" : 2,
                          "Spades3" : 3,
                          "Spades4" : 4,
                          "Spades5" : 5,
                          "Spades6" : 6,
                          "Spades7" : 7,
                          "Spades8" : 8,
                          "Spades9" : 9,
                          "Spades10" : 10,
                          "SpadesJ" : 10,
                          "SpadesQ" : 10,
                          "SpadesK" : 10,
                          "ClubsA" : 1,
                          "Clubs2" : 2,
                          "Clubs3" : 3,
                          "Clubs4" : 4,
                          "Clubs5" : 5,
                          "Clubs6" : 6,
                          "Clubs7" : 7,
                          "Clubs8" : 8,
                          "Clubs9" : 9,
                          "Clubs10" : 10,
                          "ClubsJ" : 10,
                          "ClubsQ" : 10,
                          "ClubsK" : 10,
                          "HeartsA" : 1,
                          "Hearts2" : 2,
                          "Hearts3" : 3,
                          "Hearts4" : 4,
                          "Hearts5" : 5,
                          "Hearts6" : 6,
                          "Hearts7": 7,
                          "Hearts8" : 8,
                          "Hearts9" : 9,
                          "Hearts10" : 10,
                          "HeartsJ" : 10,
                          "HeartsQ" : 10,
                          "HeartsK" : 10,
                          "DiamondsA" : 1,
                          "Diamonds2" : 2,
                          "Diamonds3" : 3,
                          "Diamonds4" : 4,
                          "Diamonds5" : 5,
                          "Diamonds6" : 6,
                          "Diamonds7" : 7,
                          "Diamonds8" : 8,
                          "Diamonds9" : 9,
                          "Diamonds10" : 10,
                          "DiamondsJ" : 10,
                          "DiamondsQ" : 10,
                          "DiamondsK" : 10},
            "Stand": false,
            "turnsOver": true,
          };

// Declare Constants
const PLAYER = hand["Player"];
const DEALER = hand["Dealer"];
const CARDS = hand["Cards"];
const CARDSMAP = hand["cardsMap"];

// Display Deal button
document.getElementById("deal").style.display = "block";

// Attach button functions
document.querySelector("#hit").addEventListener("click", hit);
document.querySelector("#deal").addEventListener("click", deal);
document.querySelector("#stand").addEventListener("click", dealerLogic);

// Hit (get player card) function
function hit() {
  if(hand["Stand"] == false) {
    let card = randomCard();

    // show card, update and show score
    showCard(card, PLAYER);
    updateScore(card, PLAYER);
    showScore(PLAYER);
  }
  // if player achieves blackjack (score of 21), end hand and compare scores 
  if(PLAYER["Score"] == 21) {
    hand["turnsOver"] = true;
    winner = computeWinner();
    showResult(winner);
  }
};

// display image of card
function showCard(card, active) {
  if(active["Score"] <= 21) {
    let cardImage = document.createElement("img");
    cardImage.src = `imgs/sprites/card${card}.png`;
    document.querySelector(active["Div"]).appendChild(cardImage);
  };
};

// deal cards (set up game) function
function deal() {
  document.getElementById("deal").style.display = "none";
  document.getElementById("hit").style.display = "inline-block";
  document.getElementById("stand").style.display = "inline-block";

  if(hand["turnsOver"] == true) {
    hand["Stand"] = false;
    
    // get reference to player and dealer's hands
    let playerCards = document.querySelector("#player").querySelectorAll("img");
    let dealerCards = document.querySelector("#dealer").querySelectorAll("img");

    // clear hands
    for(i=0; i<playerCards.length; i++) {
      playerCards[i].remove();
    };

    for(i=0; i<dealerCards.length; i++) {
      dealerCards[i].remove();
    };

    // clear score
    PLAYER["Score"] = 0;
    DEALER["Score"] = 0;

    // reset ace tracking
    PLAYER["HasAce"] = false;
    DEALER["HasAce"] = false;
    PLAYER["RemovedHighAce"] = false;
    DEALER["RemovedHighAce"] = false;

    // reflect the reset score for the player and dealer
    document.querySelector("#playerResult").textContent = 0;
    document.querySelector("#dealerResult").textContent = 0;
    document.querySelector("#result").textContent = "Hit or Stand?";
    
    hand["turnsOver"] = false;
  };

  // give the player and dealer their initial cards
  let dealerCard = randomCard();
  let playerCardOne = randomCard();
  let playerCardTwo = randomCard();
  showCard(dealerCard, DEALER);
  showCard(playerCardOne, PLAYER);
  showCard(playerCardTwo, PLAYER);
  updateScore(dealerCard, DEALER);
  updateScore(playerCardOne, PLAYER);
  updateScore(playerCardTwo, PLAYER);
  showScore(DEALER);
  showScore(PLAYER);
};

// get card function (currently infinite decks)
function randomCard() {
  let randomIndex = Math.floor(Math.random() * 52);
  return CARDS[randomIndex];
};

// update score function
function updateScore(card, active) {
  // check if the active player or dealer drew an ace
  if(card == "SpadesA" || card == "ClubsA" || card == "HeartsA" || card == "DiamondsA") {
    // track ace in hand
    if(active["HasAce"] == false) {
      active["HasAce"] = true;
    }
    // give ace a value of 11 if it will not bust the active player or dealer
    if((active["Score"] + 11) <= 21) {
      active["Score"] += 11;
    } else { // if a high ace would bust active player or dealer give default value of 1
      // and track that a high ace would cause a bust
      active["RemovedHighAce"] = true;
      active["Score"] += CARDSMAP[card];
    }
  // check if the "active" has received a high (11) ace, if a high ace has previously been
  // converted to a low (1) ace, and if the current pulled card would cause a bust.
  } else if(active["HasAce"] == true && ((active["Score"] + CARDSMAP[card]) > 21) && active["RemovedHighAce"] == false) {
    // remove high ace bonus and track removal
    active["Score"] = active["Score"] + CARDSMAP[card] - 10;
    active["RemovedHighAce"] = true;
    active["HasAce"] = false;
  // else player did not receive an Ace; add value of current card to score
  } else {
    active["Score"] += CARDSMAP[card];
  };
};

// show score function
function showScore(active) {
  let winner;
  let playerCards = document.querySelector("#player").querySelectorAll("img");

  // determine if a bust has occurred
  if(active["Score"] > 21) {
    // display "Bust!" text in place of score
    document.querySelector(active["ScoreSpan"]).textContent = "Bust!";
    if(active == PLAYER) {
      // if player bust show the game was lost
      document.querySelector("#result").textContent = "You lost!";
    } else if(active == DEALER) {
      // if dealer bust show the game was won
      document.querySelector("#result").textContent = "You win!";
    }
      // display the deal button so a new hand can be dealt
      document.getElementById("deal").style.display = "block";
      // hide other action buttons
      document.getElementById("hit").style.display = "none";
      document.getElementById("stand").style.display = "none";
      hand["turnsOver"] = true
  // check if player achieved blackjack (21) or dealer has achieved a score requiring a stand
  } else if((PLAYER["Score"] == 21) || (DEALER["Score"] > 15)) {
    // show updated score
    document.querySelector(active["ScoreSpan"]).textContent = active["Score"];
    hand["turnsOver"] = true;
    // if player did not achieve blackjack (21) on the flop, show dealers second card
    if(playerCards.length > 2) {
      let dealerCard = randomCard();
      showCard(dealerCard, DEALER);
      // update dealers score
      let updatedScore = DEALER["Score"] + CARDSMAP[dealerCard];
      document.querySelector("#dealerResult").textContent = updatedScore;
    }
    // determine winner
    winner = computeWinner();
    showResult(winner);
  // else no other special victory parameters must be checked, update score
  } else {
    document.querySelector(active["ScoreSpan"]).textContent = active["Score"];
  };
};

function dealerLogic() {
  let winner;
  // hide hit; player can no longer acquire cards
  document.getElementById("hit").style.display = "none";
  // if dealer has not achieved at least a score of 16, dealer hits
  if (!(DEALER["Score"] > 15)) {
    document.querySelector("#result").textContent = "Good Luck!"
    let card = randomCard();
    showCard(card, DEALER);
    updateScore(card, DEALER);
    showScore(DEALER);
  // else dealer has achieved a score of at least 16, compute winner
  } else {
    hand["turnsOver"] = true;
    winner = computeWinner();
    showResult(winner);
  }
};

// calculate winner function
function computeWinner() {
  let winner;
  // if player's score is less than or equal to 21
  if(PLAYER["Score"] <= 21) {
    // if player's score is higher than the dealer or if the dealer bust
    if(PLAYER["Score"] > DEALER["Score"] || DEALER["Score"] > 21) {
      // player wins
      winner = PLAYER;
    // else if the player score is less than the dealer
    } else if(PLAYER["Score"] < DEALER["Score"]) {
      // dealer wins
      winner = DEALER;
    // else if the player and dealer have the same score
    } else if(PLAYER["Score"] == DEALER["Score"]) {
      // handled in show result function
    }
  // else if player bust
  } else if(PLAYER["Score"] > 21) {
    // dealer wins
    winner = DEALER;
  };

  return winner;
};

// show game outcome function
function showResult(winner) {
  let message;
  // if game is complete
  if (hand["turnsOver"] == true) {
    if(winner == PLAYER) { // show player victory
      message = "You win!";
    } else if(winner == DEALER) { // show dealer victory
      message = "You lost!";
    } else { // show tie
      message = "Push!";
    };

    document.querySelector("#result").textContent = message;

    // Display the deal button and hide other action buttons
    document.getElementById("deal").style.display = "block";
    document.getElementById("hit").style.display = "none";
    document.getElementById("stand").style.display = "none";
  };
};