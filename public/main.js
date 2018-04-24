function Round(dealplayer) {
    this.decree = null
    this.deck = []
    this.dealplayer = dealplayer;
    this.currentWinner = "";
}

Round.prototype.createDeck = function () {
    for (let i = 0; i < suits.length; i++) {
        for (let num = 1; num < 12; num++) {
            let card = new Card(num, suits[i]);
            if (num % 2 === 1) {
                card.mechanic = game.mechanics[Math.floor(num / 2)]
            }
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
    let decree = `<img src=${this.decree.image} class="card">`;
    display.buildDecree(decree)
};

function Trick() {
    this.cards = [] // game.trick previously
    this.leadplayer = player1; //trick
    this.followplayer = player2; //trick
    this.trickwinner = player1; //trick
    this.witchReset = false; //trick
    this.hasSwan = false; //trick
}

Trick.prototype.hasSevens = function() {
    let sevens = 0
    for (let i = 0; i < 2; i++) {
        if (game.trick[i].value === 7) {
            sevens += 1
        }
    }
    return sevens
}

function Game(choice, playera, playerb) {
    this.ai = choice; //game
    this.decree = 0; //round
    this.deck = null; //round
    this.trick = []; //trick
    this.scoreCheck = 0; //??
    this.displayplayer = playera; //game
    this.remoteplayer = playerb; //game
    this.dealplayer = player1; //round <-- chosen by pass-in
    this.leadplayer = player1; //trick
    this.followplayer = player2; //trick
    this.currentWinner = ""; //round
    this.trickwinner = player1; //trick
    this.results = {
        lead: "",
        follow: "",
        winner: ""
    };
    this.swan = `Swan: If you play this and lose the trick, you lead the next trick.`;
    this.fox = `Fox: When you play this, you may exchange the decree card with a card from your hand.`;
    this.woodcutter = `Woodcutter: When you play this, draw 1 card. Then discard any 1 card to the bottom of the deck.`;
    this.treasure = `Treasure: The winner of the trick receives 1 point for each 7 in the trick.`;
    this.witch = `Witch: When determining the winner of a trick with only one 9, treat the 9 as if it were in the trump suit.`;
    this.monarch = `Monarch: When you lead this, if your opponent has any cards of the same suit, they must play either the 1 or their highest card from that suit.`;
    this.mechanics = [this.swan, this.fox, this.woodcutter, this.treasure, this.witch, this.monarch];
    this.witchReset = false; //trick
    this.hasSwan = false; //trick
    this.gameOver = false; //game? or possibly round
    this.winner = ''; //game
}

Game.prototype.whoWinning = function () {
    if (player1.score > player2.score) {
        if (player2.score === 1) {
            game.currentWinner = `${player1.name} is winning with ${player1.score} points to ${player2.name}'s 1 point.`
        } else {
            game.currentWinner = `${player1.name} is winning with ${player1.score} points to ${player2.name}'s ${player2.score} points.`
        }
    } else if (player2.score > player1.score) {
        if (player1.score === 1) {
            game.currentWinner = `${player2.name} is winning with ${player2.score} points to ${player1.name}'s 1 point.`
        } else {
            game.currentWinner = `${player2.name} is winning with ${player2.score} points to ${player1.name}'s ${player1.score} points.`
        }
    } else {
        game.currentWinner = `${player1.name} and ${player2.name} are tied with ${player1.score} points each.`
    }
    if (player1.score >= 21 || player2.score >= 21) {
        game.gameOver = true;
        if (player1.score > player2.score) {
            game.winner = `${player1.name} wins!`
        } else {
            game.winner = `${player2.name} wins!`
        }
    }

};

Game.prototype.doWitch = function () {
    let oldsuittemp = "";
    let position = 0;
    if (game.trick[0].value === 9) {
        oldsuittemp = game.trick[0].suit;
        game.trick[0].suit = round.decree.suit
    } else {
        oldsuittemp = game.trick[1].suit;
        position = 1;
        game.trick[1].suit = round.decree.suit
    }
    game.witchReset = true;
    return {
        suit: oldsuittemp,
        position: position
    }
};

Game.prototype.scoreTrick = function () {
    console.log(game.trick[0])
    console.log(game.trick[1])
    let olddata = game.trick[0].value === 9 ^ game.trick[1].value === 9 ? game.doWitch() : null
    if (game.trick[0].suit === game.trick[1].suit) {
        if (game.trick[0].value > game.trick[1].value) {
            if (game.witchReset) {
                game.trick[olddata.position].suit = olddata.suit;
                game.witchReset = false
            }
            if (game.trick[1].value === 1) {
                game.hasSwan = true
            }
            game.makeResults(game.leadplayer);
        } else {
            if (game.witchReset) {
                game.trick[olddata.position].suit = olddata.suit;
                game.witchReset = false
            }
            if (game.trick[0].value === 1) {
                game.hasSwan = true
            }
            game.makeResults(game.followplayer);
            game.flipPlayers()
        }
    } else {
        if (game.trick[1].suit === round.decree.suit) {
            if (game.witchReset) {
                game.trick[olddata.position].suit = olddata.suit;
                game.witchReset = false
            }
            if (game.trick[0].value === 1) {
                game.hasSwan = true
            }
            game.makeResults(game.followplayer);
            game.flipPlayers()
        } else {
            if (game.witchReset) {
                game.trick[olddata.position].suit = olddata.suit;
                game.witchReset = false
            }
            if (game.trick[1].value === 1) {
                game.hasSwan = true
            }
            game.makeResults(game.leadplayer);
        }
    }
    game.leadplayer.score += trick.hasSevens()
    game.leadplayer.treasure += trick.hasSevens()
    game.leadplayer.tricks.push(game.trick);
    game.trickwinner = game.leadplayer
    if (game.hasSwan) {
        game.flipPlayers();
        game.hasSwan = false
    }
};

Game.prototype.makeResults = function (winner) {
    game.results.lead = `${game.leadplayer.name} played the ${game.trick[0].value} of ${game.trick[0].suit}.`;
    game.results.follow = `${game.followplayer.name} played the ${game.trick[1].value} of ${game.trick[1].suit}.`;
    game.results.winner = `${winner.name} wins the trick!`
};

Game.prototype.flipPlayers = function () {
    let newfollow = game.leadplayer;
    let newlead = game.followplayer;
    game.leadplayer = newlead;
    game.followplayer = newfollow
};

Game.prototype.playRound = function () {
    display.buildTrick();
    if (game.displayplayer !== game.leadplayer) {
        if (game.ai) {
            game.leadplayer.leadCard();
        }
        game.displayplayer.setFollowCards()
    }
    display.buildListActive()
};

Game.prototype.gameReset = function () {
    display.buildDisplayInfo();
    if (player1 === round.dealplayer) {
        round = new Round(player2)
    } else {
        round = new Round(player1)
    }
    if (game.ai) {
        game.newRound();
        display.buildTrick();
        display.buildListActive();
    } else {
        display.build2p()
    }
};

Game.prototype.newRound = function () {
    round.createDeck();
    round.shuffleDeck();
    game.resetPlayers();
    game.followplayer.createHand(round.deck);
    game.leadplayer.createHand(round.deck);
    round.setDecree();
};

Game.prototype.resetPlayers = function () {
    if (player1 === game.dealplayer) {
        game.leadplayer = player2;
        game.followplayer = player1
    } else {
        game.leadplayer = player1;
        game.followplayer = player2
    }
};

Game.prototype.start2p = function (msg) {
    console.log("before", round.decree, msg)
    player1.tricks = []
    player2.tricks = []
    round.decree = msg['decree'];
    console.log("after", round.decree, msg)
    if (game.displayplayer.id === player1.id) {
        game.displayplayer.hand = msg['player1hand'];
    } else {
        game.displayplayer.hand = msg['player2hand'];
    }
}

Game.prototype.startTrick = function() {
    if (game.ai) {
        game.playRound()
    } else {
        if (game.leadplayer.id === game.displayplayer.id) {
            display.buildListActive();
        }
    }
}

Game.prototype.endRound = function() {
    if (game.ai) {
        game.gameReset()
    } else {
        if (game.leadplayer.id === game.displayplayer.id) {
            socket.emit('roundstartup')
        }
    }
}

Game.prototype.endTrick = function() {
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
                    game.endRound()
                }

            }
        }
        game.trick = []
        display.buildTrick()
        if (document.getElementById('leader-checkBox').checked) {
            display.buildResults("trick-leader", "lead the", game.leadplayer)
        } else {
            game.startTrick()
        }
    } else {
        game.trick = []
        display.buildTrick()
        if (player1.tricks.length + player2.tricks.length === 13) {
            if (game.leadplayer.id === game.displayplayer.id) {
                socket.emit('roundcompleted')
            }
        } else {
            if (document.getElementById('leader-checkBox').checked) {
                display.buildResults("trick-leader", "lead the", game.leadplayer)
            } else {
                game.startTrick()
            }
        }
    }
}

Game.prototype.setEventListeners = function() {
    document.getElementById("trick-leader").addEventListener("animationend", function () {
        document.getElementById("trick-leader").style.display = "none";
        game.startTrick()
    })
    document.getElementById("round-winner").addEventListener("animationend", function () {
        document.getElementById("round-winner").style.display = "none"
        game.endRound()
    })

    //from start next round in complete round
    document.getElementById("trick-winner").addEventListener("animationend", function () {
        document.getElementById("trick-winner").style.display = "none";
        game.endTrick()
    })
}



function Card(value, suit) {
    this.value = value;
    this.suit = suit;
    this.playable = true;
    this.mechanic = null;
    this.image = `images/${this.suit.toLowerCase()}${this.value}.jpg`
}

function Player(name, id) {
    this.name = name;
    this.id = id;
    this.hand = [];
    this.tricks = [];
    this.score = 0;
    this.treasure = 0;
    this.isFoxWoodcutter = false;
    this.isWoodcutter = false;
    this.roundResult = '';
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
    if (this === game.displayplayer) {
        display.buildListActive()
    }
};

Player.prototype.insertCard = function (card) {
    this.hand.push(card)
    this.sortHand()
};

Player.prototype.doFox = function (card) {
    let newcard = round.decree;
    round.decree = this.hand[card];
    let decree = `<img src=${round.decree.image} class="card">`;
    display.buildDecree(decree);
    this.hand.splice(card, 1);
    this.insertCard(newcard);
    if (this === game.displayplayer) {
        let passbutton = "";
        display.buildPassButton(passbutton);
        display.buildListInactive(card)
        this.clicked(card)
    }
};

Player.prototype.doWoodcutter = function (card) {
    let discard = this.hand[card];
    this.hand.splice(card, 1);
    if (game.ai) {
        round.deck.splice(0, 0, discard);
    } else {
        socket.emit('woodcutter', {'discard': discard})
    }
    if (this === game.displayplayer) {
        display.buildListInactive(card)
        this.clicked(card)
    }
};

Player.prototype.passFox = function (card) {
    let passbutton = '';
    display.buildPassButton(passbutton);
    this.clicked(card)
};

Player.prototype.doFoxHuman = function (card) {
    this.isFoxWoodcutter = true;
    this.playCard(card);
    display.buildTrick();
    if (game.displayplayer === game.followplayer) {
        this.resetCards();
    }
    display.buildFoxList(card);
    let passbutton = `<button onclick='game.displayplayer.passFox(${card})'>Keep the current decree card</button>`;
    display.buildPassButton(passbutton)
};

Player.prototype.doWoodcutterHuman = function (card) {
    this.isFoxWoodcutter = true;
    this.playCard(card);
    display.buildTrick();
    if (game.displayplayer === game.followplayer) {
        this.resetCards();
    }
    if (game.ai) {
        let newcard = round.deck.pop()
        this.insertWoodcutter(newcard)
    } else {
        $.post("http://localhost:8000/woodcutterdraw", null, function (data, status) {
            let card = data['newcard']
            game.displayplayer.insertWoodcutter(card)

        })
    }
};

Player.prototype.insertWoodcutter = function (card) {
    card.playable = false;
    this.insertCard(card);
    display.buildWoodcutterList();
    card.playable = true
}

Player.prototype.doFoxAI = function () {
    if (Math.floor(Math.random() * 2) === 1) {
        let card = Math.floor(Math.random() * this.hand.length);
        this.doFox(card)
    }
};

Player.prototype.doWoodcutterAI = function () {
    let card = Math.floor(Math.random() * this.hand.length);
    let discard = this.hand[card];
    this.hand.splice(card, 1);
    round.deck.splice(0, 0, discard);
    let newcard = round.deck.pop();
    this.insertCard(newcard)
};

Player.prototype.playCard = function (cardtemp) {
    game.trick.push(this.hand[cardtemp]);
    let tricknum = game.trick.length - 1;
    this.hand.splice(cardtemp, 1);
    if (this.hand.length > 0) {
        if (game.ai) {
            if (this !== game.displayplayer) {
                if (game.trick[tricknum].value === 3) {
                    this.doFoxAI()
                }
                if (game.trick[tricknum].value === 5) {
                    this.doWoodcutterAI()
                }
            }
        }
    }
};

Player.prototype.leadCard = function () {
    let card = Math.floor(Math.random() * (this.hand.length - 1))
    this.playCard(card);
    display.buildTrick(0);
};

Player.prototype.receiveScores = function (datatemp, suit) {
    if (round.decree != datatemp['decree']) {
        round.decree = datatemp['decree'];
        let decree = `<img src=${round.decree.image} class="card">`;
        display.buildDecree(decree);
    }
    if (game.displayplayer.id === datatemp['turn']) {
        game.leadplayer = game.displayplayer
        game.followplayer = game.remoteplayer
    } else {
        game.leadplayer = game.remoteplayer
        game.followplayer = game.displayplayer
    }
    game.trick = datatemp['trick'];
    player1.tricks = datatemp['player1tricks']
    player1.score = datatemp['player1score']
    player2.tricks = datatemp['player2tricks']
    player2.score = datatemp['player2score']
    game.trickwinner = datatemp['result']
    display.buildTrick()
    game.displayplayer.completeRound(suit)
}

Player.prototype.clicked = function (card) {
    if (!this.isFoxWoodcutter) {
        this.playCard(card);
        this.resetCards()
        display.buildListInactive(card)
        display.buildTrick(card);
    } else {
        this.isFoxWoodcutter = false
    }
    if (game.ai) {
        if (this === game.leadplayer) {
            game.followplayer.followCard()
        }
        game.scoreTrick(game.leadplayer, game.followplayer)
        game.trick = []
        this.completeRound(card)
    } else {
        state = {'decree': round.decree, 'trick': game.trick, 'turn': this.id, 'name': this.name, 'completed': true};
        if (game.trick.length === 2) {
            socket.emit('trickcompleted', state)
        } else {
            socket.emit('turncompleted', state)
        }
    }
}

Player.prototype.completeRound = function(suit) {
    display.buildDisplayInfo();
    if (document.getElementById('winner-checkBox').checked) {
        display.buildResults("trick-winner", "won the", game.trickwinner)
    } else {
        console.log("waiting!!")
        setTimeout(function() {
            game.endTrick()
        }, 1500)
    }
}


Player.prototype.doMonarch = function () {
    let playablecards = this.hand.filter(card => {
        if (card.suit === game.trick[0].suit) {
            return true
        } else {
            return false
        }
    })
    console.log(playablecards)
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
            if (this.hand[i].suit !== game.trick[0].suit) {
                this.hand[i].playable = false
            }
        }
        if (game.trick[0].value === 11) {
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
            if (card.suit === game.trick[0].suit) {
                return true
            } else {
                return false
            }
        })
        console.log(playablecards)
    }
    let playablecard = null
    if (game.trick[0].value === 11) {
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
    if (this.isWoodcutter) {
        this.isWoodcutter = false
    }
};

Player.prototype.hasSuit = function () {
    for (let i = 0; i < this.hand.length; i++) {
        if (this.hand[i].suit === game.trick[0].suit) {
            return true
        }
    }
    return false
};

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

Player.prototype.changeName = function (name) {
    this.name = name;
};

function Display() {

    this.buildDisplayInfo = function () {
        document.getElementById("display-name").innerHTML = game.displayplayer.name;
        document.getElementById("display-tricks").innerHTML = game.displayplayer.tricks.length;
        document.getElementById("display-score").innerHTML = game.displayplayer.score;
        document.getElementById("remote-name").innerHTML = game.remoteplayer.name;
        document.getElementById("remote-tricks").innerHTML = game.remoteplayer.tricks.length;
        document.getElementById("remote-score").innerHTML = game.remoteplayer.score
        // if (game.ai) {
        //     document.getElementById("display-name").innerHTML = `<button>${game.displayplayer.name}</button>`;
        //     document.getElementById("display-tricks").innerHTML = game.displayplayer.tricks.length;
        //     document.getElementById("display-score").innerHTML = game.displayplayer.score;
        //     document.getElementById("remote-name").innerHTML = game.remoteplayer.name;
        //     document.getElementById("remote-tricks").innerHTML = game.remoteplayer.tricks.length;
        //     document.getElementById("remote-score").innerHTML = game.remoteplayer.score
        // } else {
        //     document.getElementById("display-name").innerHTML = `<button>${game.displayplayer.name}</button>`;
        //     document.getElementById("display-tricks").innerHTML = game.displayplayer.tricks.length;
        //     document.getElementById("display-score").innerHTML = game.displayplayer.score;
        //     document.getElementById("remote-name").innerHTML =  `<button>${game.remoteplayer.name}</button>`;
        //     document.getElementById("remote-tricks").innerHTML = game.remoteplayer.tricks.length;
        //     document.getElementById("remote-score").innerHTML = game.remoteplayer.score
    }

    this.buildDecree = function (decreetemp) {
        document.getElementById("decree-card").innerHTML = `<img src=${round.decree.image} class="card" onmouseover="display.buildMechanic('${round.decree.mechanic}')" onmouseout='display.clearMechanic()'>`;
    };

    this.buildScores = function () {
        document.getElementById("last-round").innerHTML = `As of the last round:`;
        document.getElementById("player-1-tricks").innerHTML = player1.roundResult;
        document.getElementById("player-2-tricks").innerHTML = player2.roundResult;
        document.getElementById("score-update").innerHTML = game.currentWinner
    };

    this.buildWinner = function () {
        document.getElementById("game-over").innerHTML = game.winner
    };

    this.buildMechanic = function (mechanic) {
        if (mechanic !== 'null') {
            document.getElementById("mechanic").innerHTML = `${mechanic}`
        }
    };

    this.clearMechanic = function () {
        document.getElementById("mechanic").innerHTML = ""
    }

    this.buildResults = function (element, action, leadplayer) {
        let result = null
        if (element === "round-winner") {
            result = `${player1.roundResult}<br><br>${player2.roundResult}`
        } else {
            if (leadplayer.id === game.displayplayer.id) {
                result = `You ${action} trick!`
            } else {
                if (action === "lead the") {
                    result = `${game.remoteplayer.name} leads the trick!`
                } else {
                    result = `${game.remoteplayer.name} ${action} the trick!`
                }
            }
        }
        document.getElementById(element).innerHTML = `${result}`
        document.getElementById(element).style.display = "block";
    };

    this.buildTrick = function (zindex) {
        let newarray = game.trick.map(function (card) {
            let count = game.trick.indexOf(card) + 1;
            if (count === game.trick.length) {
                let style = game.displayplayer.setTrickStyle(zindex)
                return `<img src=${card.image} class="activetrick" id="trick${count}" onmouseover="display.buildMechanic('${card.mechanic}')" onmouseout='display.clearMechanic()' style=${style} >`
            } else {
                return `<img src=${card.image} class="inactivetrick" id="trick${count}" onmouseover="display.buildMechanic('${card.mechanic}')" onmouseout='display.clearMechanic()'>`
            }

        }).join("");
        document.getElementById("trick-cards").innerHTML = newarray
    };

    this.buildWoodcutterList = function () {
        let handarray = game.displayplayer.hand.map(function (card) {
            let count = game.displayplayer.hand.indexOf(card);
            let style = game.displayplayer.setListStyle(count, count, card);
            if (card.playable) {
                return `<img src=${card.image} class="card" id="card${count}" onclick='game.displayplayer.doWoodcutter(${count})' onmouseover="display.buildMechanic('${card.mechanic}')" onmouseout='display.clearMechanic()' style=${style}>`
            } else {
                return `<img src=${card.image} class="card" id="card${count}" disabled style=${style} >`
            }
        }).join("");
        document.getElementById("hand").innerHTML = handarray
    };

    this.buildFoxList = function () {
        let handarray = game.displayplayer.hand.map(function (card) {
            let count = game.displayplayer.hand.indexOf(card)
            let style = game.displayplayer.setListStyle(count, count, card);
            return `<img src=${card.image} id="card${count}" onclick='game.displayplayer.doFox(${count})' onmouseover="display.buildMechanic('${card.mechanic}')" onmouseout='display.clearMechanic()' style=${style}>`
        }).join("");
        document.getElementById("hand").innerHTML = handarray
    };

    this.buildPassButton = function (passhtml) {
        document.getElementById("pass").innerHTML = passhtml
    };

    this.buildListDeal = function () {
        let handarray = game.displayplayer.hand.map(function (card) {
            let count = game.displayplayer.hand.indexOf(card)
            let style = game.displayplayer.setListStyle(count, count, card);
            return `<img src=${card.image} class="dealcard" id="card${count}" style=${style} >`
        }).join("");
        document.getElementById("hand").innerHTML = handarray
    }

    this.buildListInactive = function (oldcount) {
        let z = 0
        let handarray = game.displayplayer.hand.map(function (card) {
            let count = game.displayplayer.hand.indexOf(card)
            if (z === oldcount) {
                z += 2
            } else {
                z += 1
            }
            let style = game.displayplayer.setListStyle(count, z, card);
            if (count < oldcount) {
                return `<img src=${card.image} class="leftcard" id="card${count}" onmouseover="display.buildMechanic('${card.mechanic}')" onmouseout='display.clearMechanic()' style=${style} >`
            } else {
                return `<img src=${card.image} class="rightcard" id="card${count}" onmouseover="display.buildMechanic('${card.mechanic}')" onmouseout='display.clearMechanic()' style=${style} >`
            }
        }).join("");
        document.getElementById("hand").innerHTML = handarray

    };

    this.buildListActive = function () {
        let tricksplayed = player1.tricks.length + player2.tricks.length;
        let handarray = game.displayplayer.hand.map(function (card) {
            let count = game.displayplayer.hand.indexOf(card);
            let style = game.displayplayer.setListStyle(count, count, card);
            if (card.playable) {
                if (card.value === 3 && tricksplayed < 12) {
                    return `<img src=${card.image} id="card${count}" onclick='game.displayplayer.doFoxHuman(${count})' onmouseover="display.buildMechanic('${card.mechanic}')" onmouseout='display.clearMechanic()' style=${style} >`
                } else if (card.value === 5 && tricksplayed < 12) {
                    return `<img src=${card.image} id="card${count}" onclick='game.displayplayer.doWoodcutterHuman(${count})' onmouseover="display.buildMechanic('${card.mechanic}')" onmouseout='display.clearMechanic()' style=${style} >`
                } else {
                    return `<img src=${card.image} id="card${count}" onclick='game.displayplayer.clicked(${count})' onmouseover="display.buildMechanic('${card.mechanic}')" onmouseout='display.clearMechanic()' style=${style} >`
                }
            } else {
                return `<img src=${card.image} id="card${count}" style=${style} >`
            }
        }).join("")
        document.getElementById("hand").innerHTML = handarray
    };

    this.build2p = function() {
        console.log("build time")
        console.log(round.decree)
        display.buildDecree();
        display.buildListDeal();
        display.buildDisplayInfo();
        if (document.getElementById('leader-checkBox').checked) {
            display.buildResults("trick-leader", "lead the", game.leadplayer)
        } else {
            game.startTrick()
        }
    }



    this.showDropdown = function(element) {
        document.getElementById(element).classList.toggle("show")
    }

    this.showModal = function(element) {
        document.getElementById(element).style.display = "block"
        if (element === 'video-tutorial-modal') {
            let tag = document.createElement('script');

            tag.src = "https://www.youtube.com/iframe_api";
            let firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        }
    }

    this.clearModal = function(element) {
        document.getElementById(element).style.display = "none"
    }
}

window.onclick = function(event) {
    if (!event.target.matches('#scoring-dropdown')) {
        document.getElementById('scoring-dropdown-content').classList.remove('show')
    }
    if (!event.target.matches('#cards-dropdown')) {
        document.getElementById('cards-dropdown-content').classList.remove('show')
    }

    if (!event.target.matches('#rules-dropdown')) {
        document.getElementById('rules-dropdown-content').classList.remove('show')
    }

    if (!event.target.matches('#user-dropdown')) {
        document.getElementById('user-dropdown-content').classList.remove('show')
    }

    if (event.target.matches('.bars')) {
        document.getElementById('user-dropdown-content').classList.toggle('show')
    }


    if (event.target.matches('.modal')) {
        document.getElementById('video-tutorial-modal').style.display = "none"
        document.getElementById('rulebook-modal').style.display = "none"
        document.getElementById('settings-modal').style.display = "none"
        pauseVideo()
    }
}

// 2. This code loads the IFrame Player API code asynchronously.
// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
//
// let tag = document.createElement('script');
// tag.src = "https://www.youtube.com/iframe_api";
// let firstScriptTag = document.getElementsByTagName('script')[0];
// firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
//
// function onYouTubeIframeAPIReady() {
//     let playertemp = new YT.Player('player', {
//         height: '390',
//         width: '640',
//         videoId: 'XTvSyn09KlY'
//         // events: {
//         //     'onReady': onPlayerReady,
//         //     'onStateChange': onPlayerStateChange
//         // }
//     });
//     return playertemp
// }
//
// let video = onYouTubeIframeAPIReady()

//
// // 4. The API will call this function when the video player is ready.
// function onPlayerReady(event) {
//     event.target.playVideo();
// }

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
// let done = false;
// function onPlayerStateChange(event) {
//     if (event.data == YT.PlayerState.PLAYING && !done) {
//         setTimeout(stopVideo, 6000);
//         done = true;
//     }
// }

// $("#flipbook").turn({
//     width: 400,
//     height: 300,
//     autoCenter: true
// });




function clickedAI() {
    player1 = new Player("Alasdair", socket.id);
    $.post("http://localhost:8000/computername", null, function (data, status) {
        player2 = new Player(data['name']);
        game = new Game(true, player1, player2);
        document.getElementById("startup").style.display = "none";
        document.getElementById("play").style.display = "block";
        game.setEventListeners()
        display.buildDisplayInfo();
        console.log(player1)
        round = new Round(player1)
        game.newRound();
        if (document.getElementById('leader-checkBox').checked) {
            display.buildResults("trick-leader", "lead the", game.leadplayer)
        } else {
            game.startTrick()
        }
    })

}

function clickedHuman() {
    socket.emit('2pgame', "I'd like to start a game.", )
    console.log(socket.id)

}

socket.on('hello', function(msg){
    console.log(msg)
})

socket.on('startup', function(msg){
    console.log(msg)
})

socket.on('gamebeginning', function(msg){
    console.log(msg)
})

socket.on('startupinfo', function(msg) {
    console.log(msg)
    player1 = new Player('Alasdair', msg['player1'])
    player2 = new Player('Kaley', msg['player2'])
    if (msg['player1'] === socket.id) {
        game = new Game(false, player1, player2)
    } else {
        game = new Game(false, player2, player1)
    }
    round = new Round(player1)
    game.resetPlayers();
    document.getElementById("startup").style.display = "none";
    document.getElementById("play").style.display = "block";
    game.setEventListeners()
    game.start2p(msg)
    display.build2p()
})

socket.on('newround', function(msg) {
    console.log('newround', msg)
    if (round.dealplayer.id === player1.id) {
        round = new Round(player2)
        game.leadplayer = player1
    } else {
        round = new Round(player1)
        game.leadplayer = player2
    }
    game.start2p(msg)
    display.build2p()
})

socket.on('turninfo', function(msg) {
    console.log("Message received!")
    console.log(msg)
    if (round.decree != msg['decree']) {
        round.decree = msg['decree'];
        display.buildDecree();
    }
    game.trick = msg['trick'];
    game.playRound()
})

socket.on('trickresults', function(msg) {
    game.displayplayer.receiveScores(msg, 0)
})

socket.on('roundresults', function(msg) {
    player1.score = msg['p1score']
    player1.roundResult = msg['p1result']
    player2.score = msg['p2score']
    player2.roundResult = msg['p2result']
    if (document.getElementById('score-checkBox').checked) {
        display.buildResults("round-winner")
    } else {
        game.endRound()
    }
})

let player1 = null;
let player2 = null;
let game = null;
let state = null;
let round = null;
let trick = new Trick;
const suits = ['Bells', 'Keys', 'Moons']
const stylesheet = document.documentElement.style
const display = new Display()

// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var video;
function onYouTubeIframeAPIReady() {
    video = new YT.Player('player', {
        height: '390',
        width: '640',
        videoId: 'XTvSyn09KlY',
    });
}


function pauseVideo() {
    video.pauseVideo();
}

// $(function(){
//
//     $("#flipbook").turn({
//         width: 400,
//         height: 300,
//         autoCenter: true
//     });
//
// })