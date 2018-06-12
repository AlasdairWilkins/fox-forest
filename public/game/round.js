function Round(round, game) {
    if (game) {
        this.deck = round.deck
        this.decree = round.decree
        this.deal = round.deal
        this.dealplayer = game.displayplayer.cookie === round.dealplayer.cookie ? game.displayplayer : game.remoteplayer
        this.receiveplayer = game.displayplayer.cookie === round.dealplayer.cookie ? game.remoteplayer : game.displayplayer
        game.displayplayer.cookie === this.dealplayer.cookie ?
            game.displayplayer.hand = round.dealplayer.hand : game.displayplayer.hand = round.receiveplayer.hand
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

Round.prototype.start = function() {
    if (this.trick.cards.length === 0) {
        if (document.getElementById('leader-checkBox').checked) {
            let leader = {name: this.trick.leadplayer.name}
            game.displayplayer.cookie === this.trick.leadplayer.cookie ? leader.display = true : leader.display = false
            display.build('trick-info', results, 'leads', leader)
        } else {
            this.trick.start()
        }
    } else {
        this.trick.resume()
    }
}

//Hmm???

// Round.prototype.start = function () {
//     this.createDeck();
//     this.shuffleDeck();
//     game.player1.createHand(round.deck);
//     game.player2.createHand(round.deck);
//     this.setDecree();
//     this.trick = new Trick(this.receiveplayer, this.dealplayer)
// };

Round.prototype.end = function() {
    if (game.twoplayer) {
        if (this.trick.leadplayer.cookie === game.displayplayer.cookie) {
            socket.emit('roundstartup', game.id)
        }
    } else {
        game.resetRound()
    }
}

Round.prototype.resetTrick = function() {
    this.trick = new Trick(this.trick)
    display.buildTrick()
    if (document.getElementById('leader-checkBox').checked) {
        display.build('trick-info', results, 'leads', this.trick.leadplayer)
    } else {
        this.trick.start()
    }
}

Round.prototype.reset = function () {
    display.build('display-info', playerInfo, 'game', game.displayplayer)
    display.build('remote-info', playerInfo, 'game', game.remoteplayer)
    display.buildTrick()
    display.buildListDeal()
};

Round.prototype.receiveTrick = function(results) {
    if (this.decree !== results.decree) {
        this.decree = results.decree;
        let carddata = {image: this.decree.image, mouseover: this.decree.mouseover}
        display.build('decree-card', cards, 'decree', carddata)
    }
    let winner = results.trick.winner
    let updateplayer
    results.trick.winner.cookie === game.player1.cookie ? updateplayer = game.player1 : updateplayer = game.player2
    updateplayer.tricks = winner.tricks
    updateplayer.score = winner.score
    let parent
    updateplayer.cookie === game.displayplayer.cookie ? parent = 'display-info' : parent = 'remote-info'
    display.build(parent, playerInfo, 'game', updateplayer)
    this.trick.winner = winner
    this.trick.loser = results.trick.loser
    this.trick.cards = results.trick.cards
    this.trick.hasSwan = results.trick.hasSwan
    display.buildTrick()
    this.trick.results()
}