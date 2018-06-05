//server-side file

const Round = require("./round")
const Player = require("./player")
const Card = require("./card")

function Game(choice, id, p1cookie, p1socket, p2cookie, p2socket) {
    this.twoplayer = choice
    this.id = id
    this.deck = this.createDeck()
    this.player1 = new Player(this.deck, active[p1cookie].name, active[p1cookie].id, p1cookie, p1socket)
    this.player2 = choice ? new Player(this.deck, active[p2cookie].name, active[p2cookie].id, p2cookie, p2socket) : new Player(this.deck)
    this.round = new Round(this.player1, this.player2, this.deck)
    this.turn = this.round.trick.leadplayer.id
    // this.state = new State(this.player1, this.player2, this.round, this.deck)
}

Game.prototype.whoWinning = function () {
    if (player1.score > player2.score) {
        if (player2.score === 1) {
            game.currentWinner = `${player1.name} is winning with ${player1.score} points to ${player2.name}'s 1 point.`
        } else {
            game.currentWinner = `${player1.name} is winning with ${player1.score} points to ${player2.name}'s ${player2.score} points.`
        }
    } else if (player2.score > player1.score) {
        if (player1.score === 1) {
            game.currentWinner = `${player2.name} is winning with ${player2.score} points to ${player1.name}'s 1 point.`
        } else {
            game.currentWinner = `${player2.name} is winning with ${player2.score} points to ${player1.name}'s ${player1.score} points.`
        }
    } else {
        game.currentWinner = `${player1.name} and ${player2.name} are tied with ${player1.score} points each.`
    }
    if (player1.score >= 21 || player2.score >= 21) {
        game.gameOver = true;
        if (player1.score > player2.score) {
            game.winner = `${player1.name} wins!`
        } else {
            game.winner = `${player2.name} wins!`
        }
    }

};

Game.prototype.update = function(state) {
    let round = this.round
    let trick = round.trick
    round.deal = state.deal
    this.deck = state.deck
    round.deck = state.deck
    round.decree = state.decree
    this.player1.cookie === state.player.cookie ? this.player1.hand = state.player.hand : this.player2.hand = state.player.hand
    trick.cards = state.trick
}

Game.prototype.createDeck = function () {
    let deck = []
    for (let i = 0; i < suits.length; i++) {
        for (let num = 1; num < 12; num++) {
            let card = new Card(num, suits[i]);
            deck.push(card);
        }
    }
    this.shuffleDeck(deck)
    return deck
};

Game.prototype.shuffleDeck = function (deck) {
    let i = 0
        , j = 0
        , temp = [];

    for (i = deck.length - 1; i > 0; i -= 1) {
        j = Math.floor(Math.random() * (i + 1));
        temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp
    }
};

const suits = ['Bells', 'Keys', 'Moons']

module.exports = Game