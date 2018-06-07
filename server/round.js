//server-side file

const Trick = require("./trick")

function Round(dealplayer, receiveplayer, deck) {
    if (deck) {
        this.decree = this.setDecree(deck)
        this.deal = dealplayer.id
        this.dealplayer = dealplayer;
        this.receiveplayer = receiveplayer
        this.trick = new Trick(this.receiveplayer, this.dealplayer)
    } else {
        this.deck = round.createDeck()
        this.deal = dealplayer.id
        this.dealplayer = dealplayer
        this.dealplayer.createHand(this.deck)
        this.receiveplayer = receiveplayer
        this.receiveplayer.createHand(this.deck)
        this.decree = this.setDecree(this.deck)
        this.trick = new Trick(this.receiveplayer, this.dealplayer)
    }
}

Round.prototype.setDecree = function (deck) {
    let decree = deck.pop();
    return decree
};

Round.prototype.createDeck = function () {
    let deck = []
    for (let i = 0; i < suits.length; i++) {
        for (let num = 1; num < 12; num++) {
            let card = new Card(num, suits[i]);
            deck.push(card);
        }
    }
    return this.shuffleDeck(deck)
};

Round.prototype.shuffleDeck = function (deck) {
    let i = 0
        , j = 0
        , temp = [];

    for (i = deck.length - 1; i > 0; i -= 1) {
        j = Math.floor(Math.random() * (i + 1));
        temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp
    }
    return deck
};

const suits = ['Bells', 'Keys', 'Moons']

module.exports = Round