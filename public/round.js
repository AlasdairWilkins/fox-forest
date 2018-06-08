function Round(round, game) {
    if (game) {
        this.deck = game.deck
        this.decree = round.decree
        this.deal = round.deal
        this.dealplayer = game.displayplayer.cookie === round.dealplayer.cookie ? game.displayplayer : game.remoteplayer
        this.receiveplayer = game.displayplayer.cookie === round.dealplayer.cookie ? game.remoteplayer : game.displayplayer
        this.trick = new Trick(round.trick, game)
    } else {
        this.deck = this.createDeck()
        this.dealplayer = round.receiveplayer
        this.dealplayer.createHand(this.deck)
        this.receiveplayer = round.dealplayer
        this.receiveplayer.createHand(this.deck)
        this.decree = this.setDecree()
        this.trick = new Trick(trick, this)
    }
}

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

Round.prototype.setDecree = function () {
    let decree = this.deck.pop();
    return decree
}

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
        if (trick.leadplayer.cookie === game.displayplayer.cookie) {
            socket.emit('roundstartup')
        }
    } else {
        game.round = new Round(this)
        round = game.round
        trick = round.trick
        round.reset()
        trick.start()
    }
}

Round.prototype.reset = function () {
    let displayInfo = new PlayerInfo(game.displayplayer)
    let remoteInfo = new PlayerInfo(game.remoteplayer)
    display.build('display-info', playerInfo, 'game', displayInfo)
    display.build('remote-info', playerInfo, 'game', remoteInfo)
    display.buildTrick()
    display.buildListDeal()
};