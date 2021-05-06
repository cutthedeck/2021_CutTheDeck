
function saveResult(win, gameName) {
	let category;
	if (win) {
		category = "Win";
	} else {
		category = "Lose";
	}
	
	let storageLocation = localStorage.getItem(gameName + category);
	
	if (storageLocation) {
		localStorage.setItem(gameName + category, Number(storageLocation) + 1);
	} else {
		localStorage.setItem(gameName + category, 1);
	}
}

var showingStats = false;
var statGames = ["blackJack", "solitaire", "war"];
var statCategories = ["Win", "Lose"];
var statNumbers = [];
// Set game name from url
let gameNameArr = window.location.href.split("/");
var currentGameName = gameNameArr[gameNameArr.length - 1]
currentGameName = currentGameName.substr(0, currentGameName.length - 5);

var $stats = $('#stats');
var $statsButton = $('#show-stats');


$statsButton.click(function() {
	//Show stats
	if (showingStats) {
		$stats.html("");
		
		showingStats = false;
		$statsButton.html("Show Stats");
		
	}
	//Hide Stats
	else {
		
		
		// Load numbers for each stat
		statNumbers = [];
		for (i = 0; i < statCategories.length; i++) {
			let currentCategory = localStorage.getItem(currentGameName + statCategories[i]);
			if (currentCategory) {
				statNumbers.push(currentCategory);
			} else {
				statNumbers.push(0);
			}
		}
		
		for (i = 0; i < statCategories.length; i++) {
			$stats.append("<br>" + statCategories[i] + ": " + statNumbers[i]);
		}
		
		
		showingStats = true;
		$statsButton.html("Hide Stats");
	}
});