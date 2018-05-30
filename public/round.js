function Round(dealplayer, receiveplayer, choice, state) {
    this.decree = null
    this.deck = choice ? [] : state.deck
    this.dealplayer = dealplayer;
    this.receiveplayer = receiveplayer
}

Round.prototype.createDeck = function () {
    for (let i = 0; i < suits.length; i++) {
        for (let num = 1; num < 12; num++) {
            let card = new Card(num, suits[i]);
            card.mechanic = display.mechanics[i]
            this.deck.push(card);
        }
    }
};

Round.prototype.shuffleDeck = function () {
    let i = 0
        , j = 0
        , temp = [];

    for (i = this.deck.length - 1; i > 0; i -= 1) {
        j = Math.floor(Math.random() * (i + 1));
        temp = this.deck[i];
        this.deck[i] = this.deck[j];
        this.deck[j] = temp
    }
};

Round.prototype.setDecree = function () {
    this.decree = this.deck.pop();
};

Round.prototype.start = function () {
    round.createDeck();
    round.shuffleDeck();
    player1.createHand(round.deck);
    player2.createHand(round.deck);
    round.setDecree();
    trick = new Trick(round.receiveplayer, round.dealplayer)
};

Round.prototype.end = function() {
    if (game.twoplayer) {
        if (trick.leadplayer.id === game.displayplayer.id) {
            socket.emit('roundstartup')
        }
    } else {
        round.reset()
    }
}

Round.prototype.reset = function () {
    display.buildDisplayInfo();
    round = new Round(round.receiveplayer, round.dealplayer)
    round.start();
    display.buildTrick();
    display.buildListActive();
};