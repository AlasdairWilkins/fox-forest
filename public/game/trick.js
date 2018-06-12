function Trick(trick, input) {
    if (input instanceof Game) {
        let game = input
        this.leadplayer = game.displayplayer.cookie === trick.leadplayer.cookie ? game.displayplayer : game.remoteplayer
        this.followplayer = game.displayplayer.cookie === trick.leadplayer.cookie ? game.remoteplayer : game.displayplayer
        this.cards = trick.cards
        this.witchReset = trick.witchReset;
        this.hasSwan = trick.hasSwan;
        this.winner = trick.winner
        this.loser = trick.loser
    } else {
        if (input instanceof Round) {
            let round = input
            this.leadplayer = round.receiveplayer
            this.followplayer = round.dealplayer
        } else {
            this.leadplayer = trick.hasSwan ? trick.loser : trick.winner
            this.followplayer = trick.hasSwan ? trick.winner : trick.loser
        }
        this.cards = []
        this.witchReset = false
        this.hasSwan = false
        this.winner = null
        this.loser = null
    }
}

Trick.prototype.doWitch = function () {
    let oldsuittemp = "";
    let position = 0;
    if (this.cards[0].value === 9) {
        oldsuittemp = this.cards[0].suit;
        this.cards[0].suit = game.round.decree.suit
    } else {
        oldsuittemp = this.cards[1].suit;
        position = 1;
        this.cards[1].suit = game.round.decree.suit
    }
    this.witchReset = true;
    return {
        suit: oldsuittemp,
        position: position
    }
};

Trick.prototype.hasSevens = function() {
    let sevens = 0
    for (let i = 0; i < 2; i++) {
        if (this.cards[i].value === 7) {
            sevens += 1
        }
    }
    return sevens
};

Trick.prototype.score = function () {
    let olddata = this.cards[0].value === 9 ^ this.cards[1].value === 9 ? this.doWitch() : null
    if (this.cards[0].suit === this.cards[1].suit) {
        if (this.cards[0].value > this.cards[1].value) {
            if (this.witchReset) {
                this.cards[olddata.position].suit = olddata.suit;
            }
            if (this.cards[1].value === 1) {
                this.hasSwan = true
            }
            this.winner = this.leadplayer
            this.loser = this.followplayer
        } else {
            if (this.witchReset) {
                this.cards[olddata.position].suit = olddata.suit;
            }
            if (this.cards[0].value === 1) {
                this.hasSwan = true
            }
            this.winner = this.followplayer
            this.loser = this.leadplayer
        }
    } else {
        if (this.cards[1].suit === game.round.decree.suit) {
            if (this.witchReset) {
                this.cards[olddata.position].suit = olddata.suit;
            }
            if (this.cards[0].value === 1) {
                this.hasSwan = true
            }
            this.winner = this.followplayer
            this.loser = this.leadplayer
        } else {
            if (this.witchReset) {
                this.cards[olddata.position].suit = olddata.suit;
            }
            if (this.cards[1].value === 1) {
                this.hasSwan = true
            }
            this.winner = this.leadplayer
            this.loser = this.followplayer
        }
    }
    this.winner.score += this.hasSevens()
    this.winner.treasure += this.hasSevens()
    this.winner.tricks.push(this.cards);
};

Trick.prototype.start = function() {
    if (game.twoplayer) {
        if (this.leadplayer.cookie === game.displayplayer.cookie) {
            display.buildListActive();
            display.build('turn', turn, 'display')
        } else {
            display.build('turn', turn, 'remote', game.remoteplayer.name)
        }
    } else {
        this.play()
    }
}


Trick.prototype.resume = function() {
    if (game.twoplayer) {
        if (this.followplayer.cookie === game.displayplayer.cookie) {
            game.displayplayer.setFollowCards()
            display.buildListActive();
            display.build('turn', turn, 'display')
        } else {
            display.build('turn', turn, 'remote', game.remoteplayer.name)
        }
    } else {
        if (this.cards.length === 1) {
            game.displayplayer.setFollowCards()
        }
        display.buildListActive()
    }
}

Trick.prototype.play = function () {
    display.buildTrick();
    if (game.displayplayer.cookie !== this.leadplayer.cookie) {
        if (!game.twoplayer) {
            this.leadplayer.leadCard();
        }
        game.displayplayer.setFollowCards()
    }
    if (game.twoplayer) {
        display.build('turn', turn, 'display')
    } else {
        game.update()
    }
    display.buildListActive()
};

Trick.prototype.results = function() {
    if (document.getElementById('winner-checkBox').checked) {
        display.build('trick-info', results, 'trick', this.winner)
    } else {
        setTimeout(function() {
            game.round.trick.end()
        }, 1500)
    }
}

Trick.prototype.end = function() {
    if (game.player1.tricks.length + game.player2.tricks.length === 13) {
        if (game.twoplayer) {
            if (this.leadplayer.cookie === game.displayplayer.cookie) {
                socket.emit('roundcompleted', game.id)
            }
        } else {
           game.scoreRound()
        }
    } else {
        game.round.resetTrick()
    }
}