//server-side file

const mechanics = [
    `Swan: If you play this and lose the trick, you lead the next trick.`,
    `Fox: When you play this, you may exchange the decree card with a card from your hand.`,
    `Woodcutter: When you play this, draw 1 card. Then discard any 1 card to the bottom of the deck.`,
    `Treasure: The winner of the trick receives 1 point for each 7 in the trick.`,
    `Witch: When determining the winner of a trick with only one 9, treat the 9 as if it were in the trump suit.`,
    `Monarch: When you lead this, if your opponent has any cards of the same suit, they must play either the 1 or their highest card from that suit.`
]

function Card(value, suit) {
    this.value = value;
    this.suit = suit;
    this.playable = true;
    this.mechanic = this.value % 2 === 1 ? mechanics[Math.floor(this.value / 2)] : null;
    this.image = `images/${this.suit.toLowerCase()}${this.value}.jpg`
}

module.exports = Card