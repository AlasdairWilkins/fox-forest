//server-side file

const Trick = require("./trick")

function Round(dealplayer, receiveplayer, deck) {
    this.decree = this.setDecree(deck)
    this.deal = dealplayer.id
    this.dealplayer = dealplayer;
    this.receiveplayer = receiveplayer
    this.trick = new Trick(this.receiveplayer, this.dealplayer)
}

Round.prototype.setDecree = function (deck) {
    let decree = deck.pop();
    return decree
};

module.exports = Round