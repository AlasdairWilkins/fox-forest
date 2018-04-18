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
    // this.trickcount = 0;
    // this.turncount = 0;
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
    let olddata = game.trick[0].value === 9 ^ game.trick[1].value === 9 ? game.doWitch() : null
    console.log(olddata)
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
        if (game.trick[0].value == 11) {
            game.displayplayer.isMonarch = true
        }
        game.displayplayer.setFollowCards()
    }
    display.buildListActive()
};

Game.prototype.gameReset = function () {
    display.buildScores();
    display.buildDisplayInfo();
    if (game.ai) {
        game.newRound();
    } else {
        //game.displayplayer.createHand(receivedhandinfo)
        //round.decree = receiveddecreeinfo
    }
    display.buildTrick();
    display.buildListActive();
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

Game.prototype.doMonarch = function (suit) {
    for (let i = 0; i < game.followplayer.hand[suit].array.length; i++) {
        if (game.followplayer.hand[suit].array[i].value === 1) {
            game.followplayer.hand[suit].array[i].playable = true
        } else if (i === game.followplayer.hand[suit].array.length - 1) {
            game.followplayer.hand[suit].array[i].playable = true
        } else {
            game.followplayer.hand[suit].array[i].playable = false
        }
    }
};

Game.prototype.start2p = function (datatemp) {
    console.log(datatemp)
    game.resetPlayers();
    round.decree = datatemp['decree'];
    if (game.displayplayer.id === player1.id) {
        game.displayplayer.hand = datatemp['player1hand'];
        game.displayplayer.handMaster = datatemp['player1hand']
    } else {
        game.displayplayer.hand = datatemp['player2hand'];
        game.displayplayer.handMaster = datatemp['player2hand']
    }

    document.getElementById("startup").style.display = "none";
    document.getElementById("play").style.display = "block";
    game.setEventListeners()
    display.buildDisplayInfo();
    let decree = `<img src=${round.decree.image} class="card">`;
    display.buildDecree(decree);
    display.buildListInactive(14);
    display.buildResults("trick-leader", "lead the", game.leadplayer)
}

Game.prototype.setEventListeners = function() {
    //from start2pturn
    document.getElementById("trick-leader").addEventListener("animationend", function () {
        document.getElementById("trick-leader").style.display = "none";
        if (game.leadplayer.id === game.displayplayer.id) {
            display.buildListActive();
        } else {
            game.displayplayer.waitForTurn()
        }
    })
    // //from game reset in complete round
    // let elem = `trickwinner${game.trickcount}`;
    // display.buildResults(elem, game.results.winner, game.trickcount);
    // document.getElementById(elem).addEventListener("animationend", function () {
    //     document.getElementById(elem).style.display = "none";
    //     game.gameReset()
    // })
    //
    // //from start next round in complete round
    document.getElementById("trick-winner").addEventListener("animationend", function () {
        document.getElementById("trick-winner").style.display = "none";
        if (game.ai) {
            game.playRound()
        } else {
            game.trick = []
            display.buildTrick()
            display.buildResults("trick-leader", "lead the", game.leadplayer)
        }

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
    this.bells = {
        array: [],
        suit: 'Bells',
        playable: true
    };
    this.keys = {
        array: [],
        suit: 'Keys',
        playable: true
    };
    this.moons = {
        array: [],
        suit: 'Moons',
        playable: true
    };
    this.hand = [];
    this.handMaster = [];
    this.tricks = [];
    this.score = 0;
    this.treasure = 0;
    this.isFoxWoodcutter = false;
    this.isWoodcutter = false;
    this.isMonarch = false;
    this.roundResult = '';
}

Player.prototype.setListStyle = function (counttemp, ztemp, suittemp, cardtemp) {
    let position = (counttemp - 1) * 75;
    if (this.hand[suittemp].playable && cardtemp.playable) {
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
    //console.log(trickstarttop)
    //console.log(trickstartleft)
    stylesheet.setProperty('--top', trickstarttop)
    stylesheet.setProperty('--left', trickstartleft)
    return `'z-index: ${zindex}'`
}

Player.prototype.createHand = function (decktemp) {
    for (let i = 0; i < 13; i++) {
        let newcard = decktemp.pop();
        if (newcard.suit === "Bells") {
            this.bells.array.push(newcard)
        } else if (newcard.suit === "Keys") {
            this.keys.array.push(newcard)
        } else {
            this.moons.array.push(newcard)
        }
    }
    this.bells.array.sort(function (a, b) {
        return a.value - b.value
    });
    this.keys.array.sort(function (a, b) {
        return a.value - b.value
    });
    this.moons.array.sort(function (a, b) {
        return a.value - b.value
    });
    this.addCards(this.bells)
    this.addCards(this.keys)
    this.addCards(this.moons)
    if (this === game.displayplayer) {
        display.buildListActive()
    }
};

Player.prototype.addCards = function (suit) {
    if (suit.array.length > 0) {
        this.hand.push(suit)
        this.handMaster.push(suit)
    }
}

Player.prototype.insertCard = function (card) {
    for (let i = 0; i < 3; i++) {
        if (card.suit === this.handMaster[i].suit) {
            this.handMaster[i].array.push(card);
            this.handMaster[i].array.sort(function (a, b) {
                return a.value - b.value
            });
            this.hand = this.handMaster.slice(0);
            for (let j = 2; j >= 0; j--) {
                if (this.hand[j].array.length === 0) {
                    this.hand.splice(j, 1)
                }
            }
        }
    }
};

Player.prototype.doFox = function (suit, value, oldcount) {
    let newcard = round.decree;
    round.decree = this.hand[suit].array[value];
    let decree = `<img src=${round.decree.image} class="card">`;
    display.buildDecree(decree);
    this.hand[suit].array.splice(value, 1);
    //console.log(newcard)
    this.insertCard(newcard);
    if (this === game.displayplayer) {
        let passbutton = "";
        display.buildPassButton(passbutton);
        display.buildListInactive(oldcount)
        this.clicked(oldcount)
    }
};

Player.prototype.doWoodcutter = function (oldcount, suit, value) {
    let discard = this.hand[suit].array[value];
    this.hand[suit].array.splice(value, 1);
    if (game.ai) {
        round.deck.splice(0, 0, discard);
    } else {
        //$.post("http://localhost:8000/woodcutterdiscard", {'discard': discard}, game.displayplayer(oldcount))
    }
    if (this === game.displayplayer) {
        display.buildListInactive(oldcount)
        this.clicked(oldcount)
    }
};

Player.prototype.passFox = function (suit, value) {
    let passbutton = '';
    display.buildPassButton(passbutton);
    this.clicked(suit, value)
};

Player.prototype.doFoxHuman = function (counttemp, suit, value) {
    this.isFoxWoodcutter = true;
    this.playCard(suit, value);
    display.buildTrick();
    if (game.displayplayer === game.followplayer) {
        this.resetCards(suit);
    }
    display.buildFoxList(suit, value);
    let passbutton = `<button onclick='game.displayplayer.passFox(${suit}, ${value})'>Keep the current decree card</button>`;
    display.buildPassButton(passbutton)
};

Player.prototype.doWoodcutterHuman = function (counttemp, suit, value) {
    this.isFoxWoodcutter = true;
    this.playCard(suit, value);
    display.buildTrick();
    if (game.displayplayer === game.followplayer) {
        this.resetCards(suit);
    }
    if (game.ai) {
        let card = round.deck.pop()
        this.insertWoodcutter(card, suit, value)
    } else {
        $.post("http://localhost:8000/woodcutterdraw", null, function (data, status) {
            let card = data['newcard']
            //console.log(card)
            game.displayplayer.insertWoodcutter(card, suit, value)

        })
    }
};

Player.prototype.insertWoodcutter = function (newcard, suittemp, valuetemp) {
    //console.log("Inserting card!")
    //console.log(newcard)
    newcard.playable = false;
    this.insertCard(newcard);
    display.buildWoodcutterList(suittemp, valuetemp);
    newcard.playable = true
}

Player.prototype.getRandomCard = function(){
    let hand = this.bells.array.concat(this.keys.array).concat(this.moons.array)
    let card = hand[Math.floor(Math.random() * hand.length)]
    console.log(card)
    let x = 0
    let y = 0
    for (let i = 0; i < this.hand.length; i++) {
        if (this.hand[i]['suit'] === card['suit']) {
            x = i
            break
        }
    }
    for (let i = 0; i < this.hand[x].array.length; i++) {
        if (this.hand[x].array[i]['value'] === card['value']) {
            y = i
            break
        }
    }
    console.log(x)
    console.log(y)
    return [x, y]
}


Player.prototype.doFoxAI = function () {
    if (Math.floor(Math.random() * 2) === 1) {
        let x = Math.floor(Math.random() * this.hand.length);
        let y = Math.floor(Math.random() * this.hand[x].array.length);
        this.doFox(x, y)
    }
};

Player.prototype.doWoodcutterAI = function () {
    let x = Math.floor(Math.random() * this.hand.length);
    let y = Math.floor(Math.random() * this.hand[x].array.length);
    let discard = this.hand[x].array[y];
    this.hand[x].array.splice(y, 1);
    round.deck.splice(0, 0, discard);
    let newcard = round.deck.pop();
    this.insertCard(newcard)
};

Player.prototype.playCard = function (suittemp, cardtemp, oldcounttemp) {
    game.trick.push(this.hand[suittemp].array[cardtemp]);
    let tricknum = game.trick.length - 1;
    if (this.hand[suittemp].array[cardtemp].mechanic !==null) {
        display.buildMechanic(this.hand[suittemp].array[cardtemp].mechanic)
    }
    this.hand[suittemp].array.splice(cardtemp, 1);
    if (this.hand[suittemp].array.length === 0) {
        // if (this === game.displayplayer) {
        //     display.buildListInactive(oldcounttemp)
        // }
        this.hand.splice(suittemp, 1);
        this.isMonarch = false
    }
    if (this.hand.length > 0) {
        if (game.ai) {
            if (game.trick[tricknum].value === 3) {
                if (this !== game.displayplayer) {
                    this.doFoxAI()
                }
            }
            if (game.trick[tricknum].value === 5) {
                if (this !== game.displayplayer) {
                    this.doWoodcutterAI()
                }
            }
        }
    }
};

Player.prototype.leadCard = function () {
    let card = this.getRandomCard()
    this.playCard(card[0], card[1]);
    display.buildTrick(0);
};

Player.prototype.waitForTurn = function () {
    let turnwait = setInterval(function () {
        $.post("http://localhost:8000/turnwaiting", {'player': game.displayplayer.id, 'wantscore': false}, function (data, status) {
            if (!data['resend']) {
                clearInterval(turnwait);
                // console.log(round.decree)
                // console.log(data['decree'])
                if (round.decree != data['decree']) {
                    round.decree = data['decree'];
                    let decree = `<img src=${round.decree.image} class="card">`;
                    display.buildDecree(decree);
                }
                game.trick = data['trick'];
                // console.log(game.trick)
                game.playRound()
            }
        })
    }, 5000)
};

Player.prototype.waitForResults = function (suittemp) {
    let turnwait = setInterval(function () {
        $.post("http://localhost:8000/roundwaiting", {'player': game.displayplayer.id, 'wantscore': false}, function (data, status) {
            if (!data['resend']) {
                clearInterval(turnwait);
                game.displayplayer.receiveScores(data, suittemp)
            }
        })
    }, 5000)
};

Player.prototype.receiveScores = function (datatemp, suit) {
    //console.log(datatemp)
    if (round.decree != datatemp['decree']) {
        round.decree = datatemp['decree'];
        let decree = `<img src=${round.decree.image} class="card">`;
        display.buildDecree(decree);
    }
    //console.log("Figuring things out time!")
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

Player.prototype.clicked = function (oldcount, x, y) {
    if (!this.isFoxWoodcutter) {
        this.playCard(x, y, oldcount);
        this.resetCards(x)
        display.buildListInactive(oldcount)
        display.buildTrick(oldcount);
    }
    if (game.ai) {
        if (this === game.leadplayer) {
            game.followplayer.followCard()
        }
        game.scoreTrick(game.leadplayer, game.followplayer)
        game.trick = []
        this.completeRound(x)
    } else {
        state = {'decree': round.decree, 'trick': game.trick, 'turn': this.id, 'name': this.name, 'completed': true};
        //console.log(state)
        //console.log(stateJSON)
        if (game.trick.length === 2) {
            socket.emit('roundcompleted', state)
            // $.post("http://localhost:8000/roundcompleted", stateJSON, function (data, status) {
            //     game.displayplayer.receiveScores(data, x)
            // })
            // $.ajax({
            //             //     url: "http://localhost:8000/roundcompleted",
            //             //     type: "POST",
            //             //     crossDomain: true,
            //             //     data: stateJSON,
            //             //     dataType: "json",
            //             //     contentType: "application/json",
            //             //     success: function (data) {
            //             //         game.displayplayer.receiveScores(data, x)
            //             //     }
            //             // })
        } else {
            socket.emit('turncompleted', state)
            // $.ajax({
            //     url: "http://localhost:8000/turncompleted",
            //     type: "POST",
            //     crossDomain: true,
            //     data: stateJSON,
            //     dataType: "json",
            //     contentType: "application/json",
            //     success: game.displayplayer.waitForResults(x)
            // })
            //$.post("http://localhost:8000/turncompleted", stateJSON, game.displayplayer.waitForResults(x))
        }
    }
}

Player.prototype.completeRound = function(suit) {
    if (this.isFoxWoodcutter) {
        this.isFoxWoodcutter = false
    }
    // } else {
    //     this.resetCards(suit)
    // }
    if (player1.tricks.length + player2.tricks.length === 13) {
        player1.hand = [];
        player2.hand = [];
        player1.getScores();
        player2.getScores();
        game.whoWinning();
        if (game.gameOver) {
            display.buildScores();
            display.buildDisplayInfo();
            display.buildWinner()
        } else {
            display.buildResults(elem, game.results.winner, game.trickcount);
            document.getElementById(elem).addEventListener("animationend", function () {
                document.getElementById(elem).style.display = "none";
                game.gameReset()
            })
        }
    } else {
        display.buildDisplayInfo();
        console.log(game.trickwinner)
        display.buildResults("trick-winner", "won the", game.trickwinner)
    }
}

Player.prototype.setFollowCards = function () {
    if (this.hasSuit()) {
        for (let i = 0; i < this.hand.length; i++) {
            if (this.hand[i].suit !== game.trick[0].suit) {
                this.hand[i].playable = false
            } else {
                if (this.isMonarch) {
                    game.doMonarch(i)
                }
            }
        }
    }
};

Player.prototype.followCard = function () {
    if (this.hasSuit()) {
        let x = 0
        let y = 0
        for (let i = 0; i < this.hand.length; i++) {
            if (this.hand[i].suit !== game.trick[0].suit) {
                this.hand[i].playable = false
            } else {
                followsuit = this.hand[i];
                x = i
                if (game.trick[0].value === 11) {
                    if (followsuit.array[0] === 1) {
                        y = Math.floor(Math.random() * 2) * (followsuit.array.length - 1)
                    } else {
                        y = followsuit.array.length - 1
                    }
                } else {
                    y = Math.floor(Math.random() * followsuit.array.length);
                }
            }
        }
        this.playCard(x, y);
        display.buildTrick(0)
    } else {
        let x = Math.floor(Math.random() * this.hand.length);
        let y = Math.floor(Math.random() * (this.hand[x].array.length));
        this.playCard(x, y);
        display.buildTrick()
    }
};

Player.prototype.resetCards = function (suittemp) {
    for (let i = 0; i < this.hand.length; i++) {
        this.hand[i].playable = true
    }
    if (this.isMonarch || this.isWoodcutter) {
        for (let i = 0; i < this.hand[suittemp].array.length; i++) {
            this.hand[suittemp].array[i].playable = true
        }
        this.isMonarch = false;
        this.isWoodcutter = false
    }
};

Player.prototype.hasSuit = function () {
    for (let i = 0; i < this.hand.length; i++) {
        if (this.hand[i].suit === game.trick[0].suit) {
            if (this.hand[i].array.length > 0) {
                return true
            }
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
    };

    this.buildDecree = function (decreetemp) {
        document.getElementById("decree-card").innerHTML = decreetemp
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
        document.getElementById("mechanic").innerHTML = mechanic
    };

    this.buildResults = function(element, action, leadplayer) {
        let result = null
        console.log("What's happening here")
        console.log(leadplayer)
        console.log(game.displayplayer)
        if (leadplayer.id === game.displayplayer.id) {
            result = `You ${action} trick!`
        } else {
            if (action === "lead the") {
                result = `${game.remoteplayer.name} leads the trick!`
            } else {
                result = `${game.remoteplayer.name} ${action} the trick!`
            }
        }
        document.getElementById(element).innerHTML = `${result}`
        document.getElementById(element).style.display = "block";
    };

    this.buildTrick = function (zindex) {
        let newarray = game.trick.map(function (element) {
            let count = game.trick.indexOf(element) + 1;
            if (count === game.trick.length) {
                let style = game.displayplayer.setTrickStyle(zindex)
                return `<img src=${element.image} class="activetrick" id="trick${count}"  style=${style} >`
            } else {
                return `<img src=${element.image} class="inactivetrick" id="trick${count}">`
            }

        }).join("");
        document.getElementById("trick-cards").innerHTML = newarray
    };

    this.buildWoodcutterList = function () {
        let count = 0;
        let handarray = "";
        for (let i = 0; i < game.displayplayer.hand.length; i++) {
            let newarray = game.displayplayer.hand[i].array.map(function (card) {
                let value = game.displayplayer.hand[i].array.indexOf(card);
                if (card.playable) {
                    count += 1;
                    let style = game.displayplayer.setListStyle(count, count, i, card);
                    return `<img src=${card.image} class="card" id="card${count}" onclick='game.displayplayer.doWoodcutter(${count}, ${i}, ${value})' style=${style}>`
                } else {
                    count += 1;
                    let style = game.displayplayer.setListStyle(count, count, i, card);
                    return `<img src=${card.image} class="card" id="card${count}" disabled style=${style} >`
                }
            }).join("");
            handarray += newarray
        }
        document.getElementById("hand").innerHTML = handarray
    };

    this.buildFoxList = function () {
        let count = 0;
        let handarray = "";
        for (let i = 0; i < game.displayplayer.hand.length; i++) {
            let newarray = game.displayplayer.hand[i].array.map(function (card) {
                let value = game.displayplayer.hand[i].array.indexOf(card);
                count += 1;
                let style = game.displayplayer.setListStyle(count, count, i, card);
                return `<img src=${card.image} id="card${count}" onclick='game.displayplayer.doFox(${i}, ${value}, ${count})' style=${style}>`
            }).join("");
            handarray += newarray
        }
        document.getElementById("hand").innerHTML = handarray
    };

    this.buildPassButton = function (passhtml) {
        document.getElementById("pass").innerHTML = passhtml
    };

    this.buildListInactive = function (oldcount) {
        let handarray = "";
        let count = 0;
        let z = 0
        for (let i = 0; i < game.displayplayer.hand.length; i++) {
            let newarray = game.displayplayer.hand[i].array.map(function (card) {
                count += 1
                if (z === oldcount) {
                    z += 2
                } else {
                    z +=1
                }
                let style = game.displayplayer.setListStyle(count, z, i, card);
                if (count < oldcount) {
                    return `<img src=${card.image} class="leftcard" id="card${count}" style=${style} >`
                } else {
                    return `<img src=${card.image} class="rightcard" id="card${count}" style=${style} >`
                }
            }).join("");
            handarray += newarray
        }
        document.getElementById("hand").innerHTML = handarray

    };

    this.buildListActive = function () {
        let handarray = "";
        let count = 0;
        let tricksplayed = player1.tricks.length + player2.tricks.length;
        for (let i = 0; i < game.displayplayer.hand.length; i++) {
            let newarray = null
            if (game.displayplayer.hand[i].playable) {
                newarray = game.displayplayer.hand[i].array.map(function (card) {
                    count += 1;
                    let style = game.displayplayer.setListStyle(count, count, i, card);
                    if (card.playable) {
                        let y = game.displayplayer.hand[i].array.indexOf(card);
                        if (card.value === 3 && tricksplayed < 12) {
                            return `<img src=${card.image} id="card${count}" onclick='game.displayplayer.doFoxHuman(${count}, ${i}, ${y})' style=${style} >`
                        } else if (card.value === 5 && tricksplayed < 12) {
                            return `<img src=${card.image} id="card${count}" onclick='game.displayplayer.doWoodcutterHuman(${count}, ${i}, ${y})' style=${style} >`
                        } else {
                            return `<img src=${card.image} id="card${count}" onclick='game.displayplayer.clicked(${count}, ${i}, ${y})' style=${style} >`
                        }
                    } else {
                        return `<img src=${card.image} class="leftcard" id="card${count}" style=${style} >`
                    }
                }).join("")
            } else {
                newarray = game.displayplayer.hand[i].array.map(function (card) {
                    count +=1;
                    let style = game.displayplayer.setListStyle(count, count, i, card);
                    return `<img src=${card.image} id="card${count}" style=${style}>`
                }).join("")
            }
            handarray += newarray
        }
        document.getElementById("hand").innerHTML = handarray
    };

}



function clickedAI() {
    player1 = new Player("Alasdair", socket.id);
    player2 = new Player("Kaley");
    game = new Game(true, player1, player2);
    document.getElementById("startup").style.display = "none";
    document.getElementById("play").style.display = "block";
    game.setEventListeners()
    display.buildDisplayInfo();
    console.log(player1)
    round = new Round(player1)
    game.newRound();
    game.playRound();
}

function clickedHuman() {
    socket.emit('2pgame', "I'd like to start a game.")
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
        console.log("Oh, you're player 1!")
        game = new Game(false, player1, player2)
    } else {
        console.log("Hi hi, you're player 2!")
        game = new Game(false, player2, player1)
    }
    round = new Round(player1)
    game.start2p(msg)
})

socket.on('turninfo', function(msg) {
    console.log("Message received!")
    console.log(msg)
    if (round.decree != msg['decree']) {
        round.decree = msg['decree'];
        let decree = `<img src=${round.decree.image} class="card">`;
        display.buildDecree(decree);
    }
    game.trick = msg['trick'];
    game.playRound()
})

socket.on('trickresults', function(msg) {
    console.log("Ooh! Items!")
    console.log(msg)
    game.displayplayer.receiveScores(msg, 0)
})



// function clickedHuman() {
//     $.post("http://localhost:8000/playerjoin", {'test': "Hello world"}, function(data, status) {
//         //console.log(data);
//         if (data['hand'] === null) {
//             player1 = new Player("Alasdair", data['id']);
//             player2 = new Player("Kaley");
//             let playerwait = setInterval(function() {
//                     $.post("http://localhost:8000/playerwaiting", null, function(data, status) {
//                         if (!data['resend']) {
//                             clearInterval(playerwait);
//                             //console.log(data);
//                             //console.log("startinggame");
//                             player2.id = data['remote']
//                             game = new Game(false, player1, player2);
//                             round = new Round(player1)
//                             game.start2p(data)
//                         } else {
//                             //console.log("waiting")
//                         }
//                     })
//                 },
//                 5000)
//         } else {
//             player1 = new Player("Alasdair", data['remote']);
//             player2 = new Player("Kaley", data['id']);
//             game = new Game(false, player2, player1);
//             round = new Round(player1)
//             game.start2p(data)
//         }
//     })
// }



let player1 = null;
let player2 = null;
let game = null;
let state = null;
let round = null;
let trick = new Trick;
const suits = ['Bells', 'Keys', 'Moons']
const stylesheet = document.documentElement.style
const display = new Display()




