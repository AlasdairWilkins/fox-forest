//server-side file

function Card(value, suit) {
    this.value = value;
    this.suit = suit;
    this.id = `${suit}${value}`
    this.playable = true
    this.mechanic = this.value % 2 === 1 ? true : false
    this.mouseover = this.mechanic ? this.setMechanic() : ''
    this.image = `images/${this.suit.toLowerCase()}${this.value}.jpg`
}

Card.prototype.setMechanic = function () {
    return `onmouseover="display.build('mechanic', mechanics, 'card${this.value}')" onmouseout="display.build('mechanic', mechanics, 'default')"`
}

module.exports = Card