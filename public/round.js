function Round(round, game) {
    this.decree = round.decree
    this.deck = game.deck
    this.deal = round.deal
    this.dealplayer = game.displayplayer.id === round.dealplayer.id ? game.displayplayer : game.remoteplayer
    this.receiveplayer = game.displayplayer.id === round.dealplayer.id ? game.remoteplayer : game.displayplayer
    this.trick = new Trick(round.trick, game)
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
    this.createDeck();
    this.shuffleDeck();
    player1.createHand(round.deck);
    player2.createHand(round.deck);
    this.setDecree();
    trick = new Trick(this.receiveplayer, this.dealplayer)
};

Round.prototype.end = function() {
    if (game.twoplayer) {
        if (trick.leadplayer.id === game.displayplayer.id) {
            socket.emit('roundstartup')
        }
    } else {
        this.reset()
    }
}

Round.prototype.reset = function () {
    display.buildDisplayInfo();
    // this = new Round(this.receiveplayer, this.dealplayer)
    // this.start();
    display.buildTrick();
    display.buildListActive();
};