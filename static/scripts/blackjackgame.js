//BlackJack 
let blackjackGame = {
    'player_1': { 'scoreSpan': '#your-blackjack-result', 'div': '#your-box', 'score': 0 },
    'dealer': { 'scoreSpan': '#dealer-blackjack-result', 'div': '#dealer-box', 'score': 0 },
    'cards': ['2b', '3b', '4b', '5b', '6b', '7b', '8b', '9b', '10b', 'Jb', 'Qb', 'Kb', 'Ab',
        '2c', '3c', '4c', '5c', '6c', '7c', '8c', '9c', '10c', 'Jc', 'Qc', 'Kc', 'Ac',
        '2k', '3k', '4k', '5k', '6k', '7k', '8k', '9k', '10k', 'Jk', 'Qk', 'Kk', 'Ak',
        '2p', '3p', '4p', '5p', '6p', '7p', '8p', '9p', '10p', 'Jp', 'Qp', 'Kp', 'Ap'],
    'cardsMap': {
        '2b': 2, '3b': 3, '4b': 4, '5b': 5, '6b': 6, '7b': 7, '8b': 8, '9b': 9, '10b': 10, 'Jb': 10, 'Qb': 10, 'Kb': 10, 'Ab': [1, 11],
        '2c': 2, '3c': 3, '4c': 4, '5c': 5, '6c': 6, '7c': 7, '8c': 8, '9c': 9, '10c': 10, 'Jc': 10, 'Qc': 10, 'Kc': 10, 'Ac': [1, 11],
        '2k': 2, '3k': 3, '4k': 4, '5k': 5, '6k': 6, '7k': 7, '8k': 8, '9k': 9, '10k': 10, 'Jk': 10, 'Qk': 10, 'Kk': 10, 'Ak': [1, 11],
        '2p': 2, '3p': 3, '4p': 4, '5p': 5, '6p': 6, '7p': 7, '8p': 8, '9p': 9, '10p': 10, 'Jp': 10, 'Qp': 10, 'Kp': 10, 'Ap': [1, 11]
    },
    'wins': 0,
    'losses': 0,
    'draws': 0,
    'isStand': false,
    'turnsOver': false,
};

const PLAYER_1 = blackjackGame['player_1'];
const DEALER = blackjackGame['dealer'];

//Add sound
const hitSound = new Audio('blackjack_assets/sounds/swish.m4a');
const winSound = new Audio('blackjack_assets/sounds/cash.mp3');
const lossSound = new Audio('blackjack_assets/sounds/aww.mp3');

//When we click on buttons - we run function
document.querySelector('#blackjack-hit-button').addEventListener('click', blackjackHit);
document.querySelector('#blackjack-stand-button').addEventListener('click', dealerLogic);
document.querySelector('#blackjack-refresh-button').addEventListener('click', blackjackRefresh);

//Function fot button "Hit"
function blackjackHit() {
    if (blackjackGame['isStand'] === false) {
        let card = randomCard();
        showCard(card, PLAYER_1);
        updateScore(card, PLAYER_1);
        showScore(PLAYER_1);
    }
}

//Generate cards
function randomCard() {
    let randomIndex = Math.floor(Math.random() * 52);
    return blackjackGame['cards'][randomIndex];
}

function showCard(card, activePlayer) {
    if (activePlayer['score'] <= 21) {
        let cardImage = document.createElement('img');
        cardImage.src = `blackjack_assets/images/${card}.png`;
        document.querySelector(activePlayer['div']).appendChild(cardImage);
        hitSound.play();
    }
}

//Functions for button "Refresh" - starts new session
function blackjackRefresh() {
    if (blackjackGame['turnsOver'] === true) {

        blackjackGame['isStand'] = false;

        let yourImages = document.querySelector('#your-box').querySelectorAll('img');
        let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');

        for (i = 0; i < yourImages.length; i++) {
            yourImages[i].remove();
        }
        for (i = 0; i < dealerImages.length; i++) {
            dealerImages[i].remove();
        }

        PLAYER_1['score'] = 0;
        DEALER['score'] = 0;
        //PLAYER RESULT
        document.querySelector('#your-blackjack-result').textContent = 0;
        document.querySelector('#your-blackjack-result').style.color = 'rgb(255, 240, 220)';
        //DEALER RESULT
        document.querySelector('#dealer-blackjack-result').textContent = 0;
        document.querySelector('#dealer-blackjack-result').style.color = 'rgb(255, 240, 220)';
        //BJ RESULT
        document.querySelector('#blackjack-result').textContent = "Let's play!";
        document.querySelector('#blackjack-result').style.color = 'rgba(10, 10, 20, 0.8)';

        blackjackGame['turnsOver'] = true;
    }
}

//SCORE >>>>>
function updateScore(card, activePlayer) {
    if (card === 'Ab' || card === 'Ac' || card === 'Ap' || card === 'Ak') {

        //if adding 11 keeps me below 21, add 11. Otherwise, add 1
        if (activePlayer['score'] + blackjackGame['cardsMap'][card][1] <= 21) {
            activePlayer['score'] += blackjackGame['cardsMap'][card][1];
        } else {
            activePlayer['score'] += blackjackGame['cardsMap'][card][0];
        }
    } else {
        activePlayer['score'] += blackjackGame['cardsMap'][card];
    }
}

function showScore(activePlayer) {
    if (activePlayer['score'] > 21) {
        document.querySelector(activePlayer['scoreSpan']).textContent = 'BUST!';
        document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
    } else {
        document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
    }
}
//SCORE <<<<<

//IO for Daeler >>>>>
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function dealerLogic() {
    blackjackGame['isStand'] = true;


    while (DEALER['score'] < 16 && blackjackGame['isStand'] === true) {
        let card = randomCard();
        showCard(card, DEALER);
        updateScore(card, DEALER);
        showScore(DEALER);
        await sleep(500); //works only in "ASYNC" functions
    }

    blackjackGame['turnsOver'] = true;
    let winner = computeWinner();
    showResult(winner);
}
//IO for Daeler <<<<<

// Who just won game
// Update the wins, draws, losses
function computeWinner() {
    let winner;

    if (PLAYER_1['score'] <= 21) {
        // condition: higher score that dealer or when dealer busts but player are 21
        if (PLAYER_1['score'] > DEALER['score'] || DEALER['score'] > 21) {
            blackjackGame['wins']++;
            winner = PLAYER_1;

        } else if (PLAYER_1['score'] < DEALER['score']) {
            blackjackGame['losses']++;
            winner = DEALER;

        } else if (PLAYER_1['score'] === DEALER['score']) {
            blackjackGame['draws']++;
        }

        // condition: when player busts but dealer dosen't   
    } else if (PLAYER_1['score'] > 21 && DEALER['score'] <= 21) {
        blackjackGame['losses']++;
        winner = DEALER;

        // condition: when player AND the dealer busts
    } else if (PLAYER_1['score'] > 21 && DEALER['score'] > 21) {
        blackjackGame['draws']++;
    }

    return winner;
}

//Show result in top div
function showResult(winner) {
    let message, messageColor;

    if (blackjackGame['turnsOver'] === true) {

        if (winner === PLAYER_1) {
            document.querySelector('#wins').textContent = blackjackGame['wins'];
            message = 'You won!';
            messageColor = 'rgb(0, 140, 20)';
            winSound.play();

        } else if (winner === DEALER) {
            document.querySelector('#losses').textContent = blackjackGame['losses'];
            message = 'You lost!';
            messageColor = 'red';
            lossSound.play();

        } else {
            document.querySelector('#draws').textContent = blackjackGame['draws'];
            message = 'You drew!';
            messageColor = 'orange';
        }

        document.querySelector('#blackjack-result').textContent = message;
        document.querySelector('#blackjack-result').style.color = messageColor;
    }
}