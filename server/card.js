//server-side file

function Card(value, suit) {
    this.value = value;
    this.suit = suit;
    this.playable = true;
    this.mechanic = null;
    this.image = `images/${this.suit.toLowerCase()}${this.value}.jpg`
}

module.exports = Card