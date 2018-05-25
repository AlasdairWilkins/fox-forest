function Trick(leadplayer, followplayer) {
    this.cards = []
    this.leadplayer = leadplayer
    this.followplayer = followplayer
    this.trickwinner = null;
    this.witchReset = false;
    this.hasSwan = false;
    this.winner = null
    this.loser = null
}

Trick.prototype.doWitch = function () {
    let oldsuittemp = "";
    let position = 0;
    if (trick.cards[0].value === 9) {
        oldsuittemp = trick.cards[0].suit;
        trick.cards[0].suit = round.decree.suit
    } else {
        oldsuittemp = trick.cards[1].suit;
        position = 1;
        trick.cards[1].suit = round.decree.suit
    }
    trick.witchReset = true;
    return {
        suit: oldsuittemp,
        position: position
    }
};

Trick.prototype.hasSevens = function() {
    let sevens = 0
    for (let i = 0; i < 2; i++) {
        if (trick.cards[i].value === 7) {
            sevens += 1
        }
    }
    return sevens
};

Trick.prototype.score = function () {
    let olddata = trick.cards[0].value === 9 ^ trick.cards[1].value === 9 ? trick.doWitch() : null
    if (trick.cards[0].suit === trick.cards[1].suit) {
        if (trick.cards[0].value > trick.cards[1].value) {
            if (trick.witchReset) {
                trick.cards[olddata.position].suit = olddata.suit;
            }
            if (trick.cards[1].value === 1) {
                trick.hasSwan = true
            }
            trick.winner = trick.leadplayer
            trick.loser = trick.followplayer
        } else {
            if (trick.witchReset) {
                trick.cards[olddata.position].suit = olddata.suit;
            }
            if (trick.cards[0].value === 1) {
                trick.hasSwan = true
            }
            trick.winner = trick.followplayer
            trick.loser = trick.leadplayer
        }
    } else {
        if (trick.cards[1].suit === round.decree.suit) {
            if (trick.witchReset) {
                trick.cards[olddata.position].suit = olddata.suit;
            }
            if (trick.cards[0].value === 1) {
                trick.hasSwan = true
            }
            trick.winner = trick.followplayer
            trick.loser = trick.leadplayer
        } else {
            if (trick.witchReset) {
                trick.cards[olddata.position].suit = olddata.suit;
            }
            if (trick.cards[1].value === 1) {
                trick.hasSwan = true
            }
            trick.winner = trick.leadplayer
            trick.loser = trick.followplayer
        }
    }
    trick.winner.score += trick.hasSevens()
    trick.winner.treasure += trick.hasSevens()
    trick.winner.tricks.push(trick.cards);
};

Trick.prototype.start = function() {
    if (game.ai) {
        trick.play()
    } else {
        if (trick.leadplayer.id === game.displayplayer.id) {
            display.buildListActive();
            display.buildDisplayTurn()
        } else {
            display.buildRemoteTurn()
        }
    }
}

Trick.prototype.play = function () {
    display.buildTrick();
    if (game.displayplayer !== trick.leadplayer) {
        if (game.ai) {
            trick.leadplayer.leadCard();
        }
        game.displayplayer.setFollowCards()
    }
    if (!game.ai) {
        display.buildDisplayTurn()
    }
    display.buildListActive()
};

Trick.prototype.results = function(suit) {
    display.buildDisplayInfo();
    if (document.getElementById('winner-checkBox').checked) {
        display.buildResults("trick-winner", "won the", trick.winner)
    } else {
        setTimeout(function() {
            trick.end()
        }, 1500)
    }
}

Trick.prototype.end = function() {
    if (game.ai) {
        if (player1.tricks.length + player2.tricks.length === 13) {
            player1.getScores();
            player2.getScores();
            if (game.gameOver) {
                display.buildScores();
                display.buildWinner()
            } else {
                if (document.getElementById('score-checkBox').checked) {
                    display.buildResults("round-winner")
                } else {
                    round.end()
                }

            }
        }
        if (trick.hasSwan) {
            trick = new Trick(trick.loser, trick.winner)
        } else {
            trick = new Trick(trick.winner, trick.loser)
        }
        display.buildTrick()
        if (document.getElementById('leader-checkBox').checked) {
            display.buildResults("trick-leader", "lead the", trick.leadplayer)
        } else {
            trick.start()
        }
    } else {
        trick.cards = []
        display.buildTrick()
        if (player1.tricks.length + player2.tricks.length === 13) {
            if (trick.leadplayer.id === game.displayplayer.id) {
                socket.emit('roundcompleted')
            }
        } else {
            if (document.getElementById('leader-checkBox').checked) {
                display.buildResults("trick-leader", "lead the", trick.leadplayer)
            } else {
                trick.start()
            }
        }
    }
}