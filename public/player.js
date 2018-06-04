//client-side file

function Player(player) {
    this.name = player.name;
    this.id = player.id;
    this.cookie = player.cookie
    this.socket = player.socket
    this.hand = player.hand;
    this.tricks = player.tricks;
    this.score = player.score
    this.treasure = player.treasure;
    // this.roundResult = '';
}

Player.prototype.setListStyle = function (counttemp, ztemp, cardtemp) {
    let position = counttemp * 75;
    if (cardtemp.playable) {
        return `'z-index: ${ztemp}; left: ${position}px'`
    } else {
        return `'z-index: ${ztemp}; left: ${position}px; filter: blur(3px);'`
    }
};

Player.prototype.setTrickStyle = function(zindex) {
    let tricktop = document.getElementById("trick-cards").getBoundingClientRect().top
    let trickleft = document.getElementById("trick-cards").getBoundingClientRect().left
    let cardtop = document.getElementById("hand").getBoundingClientRect().top
    let cardleft = document.getElementById("hand").getBoundingClientRect().left + (zindex -1) * 75
    let trickstarttop = ((cardtop - tricktop)/2) + 'px'
    let trickstartleft = (cardleft - trickleft) + 'px'
    stylesheet.setProperty('--top', trickstarttop)
    stylesheet.setProperty('--left', trickstartleft)
    return `'z-index: ${zindex}'`
}

Player.prototype.sortHand = function() {
    this.hand.sort(function(a, b) {
        if (a.suit === b.suit) {
            return a.value - b.value
        } else {
            if (a.suit > b.suit) {
                return 1
            } else {
                return -1
            }
        }
    })
}

Player.prototype.createHand = function (decktemp) {
    for (let i = 0; i < 13; i++) {
        let newcard = decktemp.pop();
        this.hand.push(newcard)
    }
    this.sortHand()
    // if (this === game.displayplayer) {
    //     display.buildListActive()
    // }
};

Player.prototype.insertCard = function (card) {
    this.hand.push(card)
    this.sortHand()
};

Player.prototype.insertWoodcutter = function (card) {
    this.insertCard(card);
    display.buildWoodcutterList();
}


Player.prototype.doFox = function (card) {
    let newcard = round.decree;
    round.decree = this.hand[card];
    let decree = `<img src=${round.decree.image} class="card">`;
    display.buildDecree(decree);
    this.hand.splice(card, 1);
    this.insertCard(newcard);
    if (this.id === game.displayplayer.id) {
        let passbutton = "";
        display.buildPassButton(passbutton);
        display.buildListInactive(card)
        this.finishTurn(card)
    }
};

Player.prototype.doWoodcutter = function (card) {
    let discard = this.hand[card];
    this.hand.splice(card, 1);
    if (game.twoplayer) {
        //$.post("http://localhost:8000/woodcutterdiscard", {'discard': discard}, game.displayplayer(oldcount))
    } else {
        round.deck.splice(0, 0, discard);
    }
    if (this.id === game.displayplayer.id) {
        display.buildListInactive(card)
        this.finishTurn(card)
    }
};

Player.prototype.passFox = function (card) {
    let passbutton = '';
    display.buildPassButton(passbutton);
    this.finishTurn(card)
};

Player.prototype.doFoxAI = function () {
    if (Math.floor(Math.random() * 2) === 1) {
        let card = Math.floor(Math.random() * this.hand.length);
        this.doFox(card)
    }
};

Player.prototype.doWoodcutterAI = function () {
    let newcard = round.deck.pop();
    this.insertCard(newcard)
    let card = Math.floor(Math.random() * this.hand.length);
    let discard = this.hand[card];
    this.hand.splice(card, 1);
    round.deck.splice(0, 0, discard);
};

Player.prototype.playCard = function (cardtemp) {
    trick.cards.push(this.hand[cardtemp]);
    let tricknum = trick.cards.length - 1;
    this.hand.splice(cardtemp, 1);
    if (this.hand.length > 0) {
        if (!game.twoplayer) {
            if (this !== game.displayplayer) {
                if (trick.cards[tricknum].value === 3) {
                    this.doFoxAI()
                }
                if (trick.cards[tricknum].value === 5) {
                    this.doWoodcutterAI()
                }
            }
        }
    }
};

Player.prototype.doFoxHuman = function (card) {
    this.playCard(card);
    display.buildTrick();
    if (game.displayplayer.id === trick.followplayer.id) {
        this.resetCards();
    }
    display.buildFoxList(card);
    let passbutton = `<button onclick='game.displayplayer.passFox(${card})'>Keep the current decree card</button>`;
    display.buildPassButton(passbutton)
};


Player.prototype.doWoodcutterHuman = function (card) {
    this.playCard(card);
    display.buildTrick();
    if (game.displayplayer.id === trick.followplayer.id) {
        this.resetCards();
    }
    this.resetCards()
    if (game.twoplayer) {
        $.post("/woodcutterdraw", null, function (data, status) {
            let card = data['newcard']
            game.displayplayer.insertWoodcutter(card)
        })
    } else {
        let newcard = round.deck.pop()
        this.insertWoodcutter(newcard)
    }
};

Player.prototype.leadCard = function () {
    let card = Math.floor(Math.random() * (this.hand.length - 1))
    this.playCard(card);
    display.buildTrick(0);
};

Player.prototype.clicked = function(card) {
    this.playCard(card);
    this.resetCards()
    display.buildListInactive(card)
    display.buildTrick(card);
    this.finishTurn()

}

Player.prototype.finishTurn = function (card) {
    if (game.twoplayer) {
        state = {'decree': round.decree, 'trick': trick.cards, 'turn': this.id, 'hand': this.hand};
        // 'name': this.name, 'completed': true
        if (trick.cards.length === 2) {
            socket.emit('trickcompleted', state)
        } else {
            display.buildRemoteTurn()
            socket.emit('turncompleted', state)
        }
    } else {
        if (this === trick.leadplayer) {
            trick.followplayer.followCard()
        }
        trick.score(trick.leadplayer, trick.followplayer)
        trick.results(card)
    }
}

Player.prototype.doMonarch = function () {
    let playablecards = this.hand.filter(card => {
        if (card.suit === trick.cards[0].suit) {
            return true
        } else {
            return false
        }
    })
    for (let i = 0; i < playablecards.length; i++) {
        if (playablecards[i].value === 1) {
            playablecards[i].playable = true
        } else if (playablecards.indexOf(playablecards[i]) === playablecards.length - 1) {
            playablecards[i].playable = true
        } else {
            playablecards[i].playable = false
        }

    }
};

Player.prototype.setFollowCards = function () {
    if (this.hasSuit()) {
        for (let i = 0; i < this.hand.length; i++) {
            if (this.hand[i].suit !== trick.cards[0].suit) {
                this.hand[i].playable = false
            }
        }
        if (trick.cards[0].value === 11) {
            this.doMonarch()
        }
    }
}

Player.prototype.followCard = function () {
    let playablecards = this.hand
    console.log("made it here")
    if (this.hasSuit()) {
        console.log("in the if!")
        playablecards = this.hand.filter(card => {
            console.log(card)
            if (card.suit === trick.cards[0].suit) {
                return true
            } else {
                return false
            }
        })
        console.log(playablecards)
    }
    let playablecard = null
    if (trick.cards[0].value === 11) {
        if (playablecards[0].value === 1)  {
            playablecard = Math.floor(Math.random() * 2) * (playablecards.length - 1)
        } else {
            playablecard = playablecards.length - 1
        }
    } else {
        playablecard = Math.floor(Math.random() * (playablecards.length));
    }
    console.log(playablecards[playablecard])
    let card = this.hand.indexOf(playablecards[playablecard])
    this.playCard(card);
    display.buildTrick()
}


Player.prototype.resetCards = function () {
    for (let i = 0; i < this.hand.length; i++) {
        this.hand[i].playable = true
    }
};

Player.prototype.hasSuit = function () {
    for (let i = 0; i < this.hand.length; i++) {
        if (this.hand[i].suit === trick.cards[0].suit) {
            return true
        }
    }
    return false
};

Player.prototype.receiveScores = function (state, suit) {
    if (round.decree !== state.decree) {
        round.decree = state.decree;
        let decree = `<img src=${round.decree.image} class="card">`;
        display.buildDecree(decree);
    }
    if (game.displayplayer.id === state.turn) {
        trick.leadplayer = game.displayplayer
        trick.followplayer = game.remoteplayer
    } else {
        trick.leadplayer = game.remoteplayer
        trick.followplayer = game.displayplayer
    }
    trick.cards = state.trick;
    player1.tricks = state.player1.tricks
    player2.tricks = state.player2.tricks
    if (player1.score !== state.player1.score || player2.score !== state.player2.score) {
        player1.score = state.player1.score
        player2.score = state.player2.score
        display.buildDisplayInfo()
    }
    if (state.player1.wonLast) {
        trick.winner = player1
    } else {
        trick.winner = player2
    }


    display.buildTrick()
    trick.results(suit)
}

Player.prototype.getScores = function () {
    let tricks = this.tricks.length;
    let score = 0;
    if (tricks <= 3) {
        score = 6
    } else if (tricks === 4) {
        score = 1
    } else if (tricks === 5) {
        score = 2
    } else if (tricks === 6) {
        score += 3
    } else if (7 <= tricks && tricks <= 9) {
        score += 6
    }
    if (this.treasure === 0) {
        if (tricks === 1) {
            this.roundResult = `${this.name} won  1 trick and scored 6 points.`
        } else if (score === 1) {
            this.roundResult = `${this.name} won 4 tricks and scored 1 point.`
        } else {
            this.roundResult = `${this.name} won ${this.tricks.length} tricks and scored ${score} points.`
        }
    } else if (this.treasure === 1) {
        if (tricks === 1) {
            this.roundResult = `${this.name} won  1 trick, collected 1 treasure, and scored 7 points.`
        } else if (tricks >= 10) {
            this.roundResult = `${this.name} won  ${this.tricks.length} tricks, collected 1 treasure, and scored 1 point.`
        }
        else {
            let treasurescore = score + 1;
            this.roundResult = `${this.name} won ${this.tricks.length} tricks, collected 1 treasure, and scored ${treasurescore} points.`
        }
    } else {
        let treasurescore = score + this.treasure;
        if (tricks === 1) {
            this.roundResult = `${this.name} won 1 trick, collected ${this.treasure} treasures, and scored ${treasurescore} points.`
        } else {
            this.roundResult = `${this.name} won ${this.tricks.length} tricks, collected ${this.treasure} treasures, and scored ${treasurescore} points.`
        }
    }
    this.score += score;
    this.treasure = 0;
    this.tricks = []
};