function Game(choice, playera, playerb) {
    this.ai = choice;
    this.trickcount = 0;
    this.turncount = 0;
    this.decree = 0;
    this.deck = [];
    this.buildDeck = function () {
        var suits = ['Bells', 'Keys', 'Moons'];
        for (var i = 0; i < suits.length; i++) {
            for (var num = 1; num < 12; num++) {
                var card = new Card(num, suits[i]);
                if (num % 2 === 1) {
                    card.hasMechanic = true;
                    card.mechanic = this.mechanics[Math.floor(num / 2)]
                }
                this.deck.push(card);
            }
        }
    };
    this.trick = [];
    this.scoreCheck = 0;
    this.displayplayer = playera;
    this.remoteplayer = playerb;
    this.dealplayer = player2;
    this.leadplayer = player1;
    this.followplayer = player2;
    this.currentWinner = "";
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
    this.witchReset = false;
    this.hasSwan = false;
    this.gameOver = false;
    this.winner = '';
    this.shuffleDeck = function () {
        var i = 0
            , j = 0
            , temp = [];

        for (i = this.deck.length - 1; i > 0; i -= 1) {
            j = Math.floor(Math.random() * (i + 1));
            temp = this.deck[i];
            this.deck[i] = this.deck[j];
            this.deck[j] = temp
        }
    };
    this.setDecree = function () {
        this.decree = this.deck.pop();
        var decree = `<img src=${this.decree.image} class="card">`;
        this.buildDecree(decree)
    };

    this.buildDecree = function (decreetemp) {
        document.getElementById("decree-card").innerHTML = decreetemp
    };

    this.whoWinning = function () {
        if (player1.score > player2.score) {
            if (player2.score === 1) {
                this.currentWinner = `${player1.name} is winning with ${player1.score} points to ${player2.name}'s 1 point.`
            } else {
                this.currentWinner = `${player1.name} is winning with ${player1.score} points to ${player2.name}'s ${player2.score} points.`
            }
        } else if (player2.score > player1.score) {
            if (player1.score === 1) {
                this.currentWinner = `${player2.name} is winning with ${player2.score} points to ${player1.name}'s 1 point.`
            } else {
                this.currentWinner = `${player2.name} is winning with ${player2.score} points to ${player1.name}'s ${player1.score} points.`
            }
        } else {
            this.currentWinner = `${player1.name} and ${player2.name} are tied with ${player1.score} points each.`
        }
        if (player1.score >= 21 || player2.score >= 21) {
            this.gameOver = true;
            if (player1.score > player2.score) {
                this.winner = `${player1.name} wins!`
            } else {
                this.winner = `${player2.name} wins!`
            }
        }

    };

    this.buildDisplayInfo = function () {
        document.getElementById("display-name").innerHTML = this.displayplayer.name;
        document.getElementById("display-tricks").innerHTML = this.displayplayer.tricks.length;
        document.getElementById("display-score").innerHTML = this.displayplayer.score;
        document.getElementById("remote-name").innerHTML = this.remoteplayer.name;
        document.getElementById("remote-tricks").innerHTML = this.remoteplayer.tricks.length;
        document.getElementById("remote-score").innerHTML = this.remoteplayer.score

    };

    this.doWitch = function () {
        var oldsuittemp = "";
        var position = 0;
        if (this.trick[0].value === 9) {
            oldsuittemp = this.trick[0].suit;
            this.trick[0].suit = game.decree.suit
        } else {
            oldsuittemp = this.trick[1].suit;
            position = 1;
            this.trick[1].suit = game.decree.suit
        }
        this.witchReset = true;
        return {
            suit: oldsuittemp,
            position: position
        }
    };

    this.scoreTrick = function () {
        if (this.trick[0].value === 9 || this.trick[1].value === 9) {
            if (this.trick[0].value !== this.trick[1].value) {
                var olddata = this.doWitch()
            }
        }
        if (this.trick[0].suit === this.trick[1].suit) {
            if (this.trick[0].value > this.trick[1].value) {
                if (this.witchReset) {
                    this.trick[olddata.position].suit = olddata.suit;
                    this.witchReset = false
                }
                if (this.trick[1].value === 1) {
                    this.hasSwan = true
                }
                this.makeResults(this.leadplayer);
            } else {
                if (this.witchReset) {
                    this.trick[olddata.position].suit = olddata.suit;
                    this.witchReset = false
                }
                if (this.trick[0].value === 1) {
                    this.hasSwan = true
                }
                this.makeResults(this.followplayer);
                this.flipPlayers()
            }
        } else {
            if (this.trick[1].suit === this.decree.suit) {
                if (this.witchReset) {
                    this.trick[olddata.position].suit = olddata.suit;
                    this.witchReset = false
                }
                if (this.trick[0].value === 1) {
                    this.hasSwan = true
                }
                this.makeResults(this.followplayer);
                this.flipPlayers()
            } else {
                if (this.witchReset) {
                    this.trick[olddata.position].suit = olddata.suit;
                    this.witchReset = false
                }
                if (this.trick[1].value === 1) {
                    this.hasSwan = true
                }
                this.makeResults(this.leadplayer);
            }
        }
        if (this.trick[0].value === 7 || this.trick[1].value === 7) {
            if (this.trick[0].value === this.trick[1].value[1]) {
                this.leadplayer.score += 2;
                this.leadplayer.treasure += 2
            } else {
                this.leadplayer.score += 1;
                this.leadplayer.treasure += 1
            }
        }
        this.leadplayer.tricks.push(this.trick);
        if (this.hasSwan) {
            this.flipPlayers();
            this.hasSwan = false
        }
    };

    this.makeResults = function (winner) {
        this.results.lead = `${this.leadplayer.name} played the ${this.trick[0].value} of ${this.trick[0].suit}.`;
        this.results.follow = `${this.followplayer.name} played the ${this.trick[1].value} of ${this.trick[1].suit}.`;
        this.results.winner = `${winner.name} wins the trick!`
    };

    this.flipPlayers = function () {
        var newfollow = this.leadplayer;
        var newlead = this.followplayer;
        this.leadplayer = newlead;
        this.followplayer = newfollow
    };

    this.buildScores = function () {
        document.getElementById("last-round").innerHTML = `As of the last round:`;
        document.getElementById("player-1-tricks").innerHTML = player1.roundResult;
        document.getElementById("player-2-tricks").innerHTML = player2.roundResult;
        document.getElementById("score-update").innerHTML = this.currentWinner
    };

    this.buildWinner = function () {
        document.getElementById("game-over").innerHTML = this.winner
    };

    this.buildResults = function (elemtemp, winner, counter) {
        counter += 1;
        document.getElementById("trick-winner").innerHTML = `<div id="${elemtemp}">${winner}</div>`;
        document.getElementById(elemtemp).style.display = "block";
    };


    this.buildMechanic = function (mechanic) {
        document.getElementById("mechanic").innerHTML = mechanic
    };

    this.playRound = function () {
        this.displayplayer.buildTrick();
        if (this.displayplayer !== this.leadplayer) {
            if (this.ai) {
                this.leadplayer.leadCard();
            }
            if (this.trick[0].value == 11) {
                this.displayplayer.isMonarch = true
            }
            this.displayplayer.setFollowCards()
        }
        this.displayplayer.buildListActive()
    };

    this.gameReset = function () {
        this.buildScores();
        this.buildDisplayInfo();
        if (this.ai) {
            this.newRound();
        } else {
            //game.displayplayer.createHand(receivedhandinfo)
            //game.decree = receiveddecreeinfo
        }
        game.displayplayer.buildTrick();
        game.displayplayer.buildListActive();
    };

    this.newRound = function () {
        this.deck = [];
        this.buildDeck();
        this.shuffleDeck();
        this.resetPlayers();
        this.followplayer.createHand(this.deck);
        this.leadplayer.createHand(this.deck);
        game.setDecree();
    };

    this.resetPlayers = function () {
        if (player1 === this.dealplayer) {
            this.dealplayer = player2;
            this.leadplayer = player1;
            this.followplayer = player2
        } else {
            this.dealplayer = player1;
            this.leadplayer = player2;
            this.followplayer = player1
        }
    };

    this.doMonarch = function (suit) {
        for (var i = 0; i < this.followplayer.hand[suit].array.length; i++) {
            if (this.followplayer.hand[suit].array[i].value === 1) {
                this.followplayer.hand[suit].array[i].playable = true
            } else if (i === this.followplayer.hand[suit].array.length - 1) {
                this.followplayer.hand[suit].array[i].playable = true
            } else {
                this.followplayer.hand[suit].array[i].playable = false
            }
        }
    };

    this.start2p = function (datatemp) {
        this.resetPlayers();
        this.decree = datatemp['decree'];
        this.displayplayer.hand = datatemp['hand'];
        this.displayplayer.handMaster = datatemp['hand']
        document.getElementById("startup").style.display = "none";
        document.getElementById("play").style.display = "block";
        this.buildDisplayInfo();
        var decree = `<img src=${game.decree.image} class="card">`;
        this.buildDecree(decree);
        this.displayplayer.buildListInactive(14);
        this.start2pTurn(datatemp['turn'])

    }

    this.buildWhoLeads = function(elemtemp, leadplayer) {
        if (leadplayer === this.displayplayer.id) {
            var whoseturn = "You lead this trick!"
        } else {
            var whoseturn = `${this.remoteplayer.name} leads this trick!`
        }
        this.buildResults(elemtemp, whoseturn, this.turncount);
    }

    this.start2pTurn = function(leadplayer) {
        // console.log("Made it to the next round!")
        // console.log(leadplayer)
        var elem = `turn${this.turncount}`;
        this.buildWhoLeads(elem, leadplayer)
        document.getElementById(elem).addEventListener("animationend", function () {
            document.getElementById(elem).style.display = "none";
            // console.log(leadplayer)
            // console.log(game.displayplayer.id)
            if (leadplayer === game.displayplayer.id) {
                game.displayplayer.buildListActive();
                // console.log("Your turn!")
            } else {
                // console.log("Their turn!")
                game.displayplayer.waitForTurn()
            }
        })
    }

}


function Card(value, suit) {
    this.value = value;
    this.suit = suit;
    this.playable = true;
    this.hasMechanic = false;
    this.mechanic = 0;
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

    this.buildTrick = function (zindex) {
        var newarray = game.trick.map(function (element) {
            var count = game.trick.indexOf(element) + 1;
            if (count === game.trick.length) {
                var style = game.displayplayer.setTrickStyle(zindex)
                return `<img src=${element.image} class="activetrick" id="trick${count}"  style=${style} >`
            } else {
                return `<img src=${element.image} class="inactivetrick" id="trick${count}">`
            }

        }).join("");
        document.getElementById("trick-cards").innerHTML = newarray
    };

    this.buildWoodcutterList = function () {
        var count = 0;
        var handarray = "";
        for (var i = 0; i < this.hand.length; i++) {
            var newarray = this.hand[i].array.map(function (card) {
                var value = game.displayplayer.hand[i].array.indexOf(card);
                if (card.playable) {
                    count += 1;
                    var style = game.displayplayer.setListStyle(count, count, i, card);
                    return `<img src=${card.image} class="card" id="card${count}" onclick='game.displayplayer.doWoodcutter(${count}, ${i}, ${value})' style=${style}>`
                } else {
                    count += 1;
                    var style = game.displayplayer.setListStyle(count, count, i, card);
                    return `<img src=${card.image} class="card" id="card${count}" disabled style=${style} >`
                }
            }).join("");
            handarray += newarray
        }
        document.getElementById("hand").innerHTML = handarray
    };

    this.buildFoxList = function () {
        var count = 0;
        var handarray = "";
        for (var i = 0; i < this.hand.length; i++) {
            var newarray = this.hand[i].array.map(function (card) {
                var value = game.displayplayer.hand[i].array.indexOf(card);
                count += 1;
                var style = game.displayplayer.setListStyle(count, count, i, card);
                return `<img src=${card.image} id="card${count}" onclick='game.displayplayer.doFox(${i}, ${value}, ${count})' style=${style}>`
            }).join("");
            handarray += newarray
        }
        document.getElementById("hand").innerHTML = handarray
    };

    this.buildPassButton = function (passhtml) {
        document.getElementById("pass").innerHTML = passhtml
    };

    this.setListStyle = function (counttemp, ztemp, suittemp, cardtemp) {
        var position = (counttemp - 1) * 75;
        if (this.hand[suittemp].playable && cardtemp.playable) {
            return `'z-index: ${ztemp}; left: ${position}px'`
        } else {
            return `'z-index: ${ztemp}; left: ${position}px; filter: blur(3px);'`
        }
    };

    this.setTrickStyle = function(zindex) {
        console.log("Trick pretty!")
        console.log(this.name)
        console.log(game.displayplayer.name)
        var tricktop = document.getElementById("trick-cards").getBoundingClientRect().top
        var trickleft = document.getElementById("trick-cards").getBoundingClientRect().left
        var cardtop = document.getElementById("hand").getBoundingClientRect().top
        var cardleft = document.getElementById("hand").getBoundingClientRect().left + (zindex -1) * 75
        var trickstarttop = ((cardtop - tricktop)/2) + 'px'
        var trickstartleft = (cardleft - trickleft) + 'px'
        //console.log(trickstarttop)
        //console.log(trickstartleft)
        stylesheet.setProperty('--top', trickstarttop)
        stylesheet.setProperty('--left', trickstartleft)
        return `'z-index: ${zindex}'`
    }

    this.buildListInactive = function (oldcount) {
        var handarray = "";
        var count = 0;
        var z = 0
        for (var i = 0; i < this.hand.length; i++) {
            var newarray = this.hand[i].array.map(function (card) {
                count += 1
                if (z === oldcount) {
                    z += 2
                } else {
                    z +=1
                }
                var style = game.displayplayer.setListStyle(count, z, i, card);
                if (count < oldcount) {
                    return `<img src=${card.image} class="leftcard" id="card${count}" style=${style} >`
                } else if (count === oldcount) {
                    return `<img src=${card.image} class="trick" id="card${count}" style=${style} >`
                } else {
                    return `<img src=${card.image} class="rightcard" id="card${count}" style=${style} >`
                }
            }).join("");
            handarray += newarray
        }
        document.getElementById("hand").innerHTML = handarray

    };

    this.buildListActive = function () {
        var handarray = "";
        var count = 0;
        var tricksplayed = player1.tricks.length + player2.tricks.length;
        for (var i = 0; i < this.hand.length; i++) {
            if (this.hand[i].playable) {
                var newarray = this.hand[i].array.map(function (card) {
                    count += 1;
                    var style = game.displayplayer.setListStyle(count, count, i, card);
                    if (card.playable) {
                        var y = game.displayplayer.hand[i].array.indexOf(card);
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
                var newarray = this.hand[i].array.map(function (card) {
                    count +=1;
                    var style = game.displayplayer.setListStyle(count, count, i, card);
                    return `<img src=${card.image} id="card${count}" style=${style}>`
                }).join("")
            }
            handarray += newarray
        }
        document.getElementById("hand").innerHTML = handarray
    };

    this.createHand = function (decktemp) {
        for (var i = 0; i < 13; i++) {
            var newcard = decktemp.pop();
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
            this.buildListActive()
        }
    };

    this.addCards = function (suit) {
        if (suit.array.length > 0) {
            this.hand.push(suit)
            this.handMaster.push(suit)
        }
    }

    this.insertCard = function (card) {
        for (var i = 0; i < 3; i++) {
            if (card.suit === this.handMaster[i].suit) {
                this.handMaster[i].array.push(card);
                this.handMaster[i].array.sort(function (a, b) {
                    return a.value - b.value
                });
                this.hand = this.handMaster.slice(0);
                for (var j = 2; j >= 0; j--) {
                    if (this.hand[j].array.length === 0) {
                        this.hand.splice(j, 1)
                    }
                }
            }
        }
    };

    this.doFox = function (suit, value, oldcount) {
        var newcard = game.decree;
        game.decree = this.hand[suit].array[value];
        var decree = `<img src=${game.decree.image} class="card">`;
        game.buildDecree(decree);
        this.hand[suit].array.splice(value, 1);
        //console.log(newcard)
        this.insertCard(newcard);
        if (this === game.displayplayer) {
            var passbutton = "";
            this.buildPassButton(passbutton);
            this.buildListInactive(oldcount)
            this.clicked(oldcount)
        }
    };

    this.doWoodcutter = function (oldcount, suit, value) {
        var discard = this.hand[suit].array[value];
        this.hand[suit].array.splice(value, 1);
        if (game.ai) {
            game.deck.splice(0, 0, discard);
        } else {
            //$.post("http://localhost:8000/woodcutterdiscard", {'discard': discard}, game.displayplayer(oldcount))
        }
        if (this === game.displayplayer) {
            this.buildListInactive(oldcount)
            this.clicked(oldcount)
        }
    };

    this.passFox = function (suit, value) {
        var passbutton = '';
        this.buildPassButton(passbutton);
        this.clicked(suit, value)
    };

    this.doFoxHuman = function (counttemp, suit, value) {
        this.isFoxWoodcutter = true;
        this.playCard(suit, value);
        this.buildTrick(true);
        if (game.displayplayer === game.followplayer) {
            this.resetCards(suit);
        }
        this.buildFoxList(suit, value);
        var passbutton = `<button onclick='game.displayplayer.passFox(${suit}, ${value})'>Keep the current decree card</button>`;
        this.buildPassButton(passbutton)
    };

    this.doWoodcutterHuman = function (counttemp, suit, value) {
        this.isFoxWoodcutter = true;
        this.playCard(suit, value);
        this.buildTrick(true);
        if (game.displayplayer === game.followplayer) {
            this.resetCards(suit);
        }
        if (game.ai) {
            var card = game.deck.pop()
            this.insertWoodcutter(card, suit, value)
        } else {
            $.post("http://localhost:8000/woodcutterdraw", null, function (data, status) {
                var card = data['newcard']
                //console.log(card)
                game.displayplayer.insertWoodcutter(card, suit, value)

            })
        }
    };

    this.insertWoodcutter = function (newcard, suittemp, valuetemp) {
        //console.log("Inserting card!")
        //console.log(newcard)
        newcard.playable = false;
        this.insertCard(newcard);
        this.buildWoodcutterList(suittemp, valuetemp);
        newcard.playable = true
    }

    this.doFoxAI = function () {
        if (Math.floor(Math.random() * 2) === 1) {
            var x = Math.floor(Math.random() * this.hand.length);
            var y = Math.floor(Math.random() * this.hand[x].array.length);
            this.doFox(x, y)
        }
    };

    this.doWoodcutterAI = function () {
        var x = Math.floor(Math.random() * this.hand.length);
        var y = Math.floor(Math.random() * this.hand[x].array.length);
        var discard = this.hand[x].array[y];
        this.hand[x].array.splice(y, 1);
        game.deck.splice(0, 0, discard);
        var newcard = game.deck.pop();
        this.insertCard(newcard)
    };

    this.playCard = function (suittemp, cardtemp, oldcounttemp) {
        game.trick.push(this.hand[suittemp].array[cardtemp]);
        var tricknum = game.trick.length - 1;
        if (this.hand[suittemp].array[cardtemp].hasMechanic) {
            game.buildMechanic(this.hand[suittemp].array[cardtemp].mechanic)
        }
        this.hand[suittemp].array.splice(cardtemp, 1);
        if (this.hand[suittemp].array.length === 0) {
            // if (this === game.displayplayer) {
            //     this.buildListInactive(oldcounttemp)
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

    this.leadCard = function () {
        var x = Math.floor(Math.random() * this.hand.length);
        var y = Math.floor(Math.random() * (this.hand[x].array.length));
        this.playCard(x, y);
        this.buildTrick(0);
    };

    this.waitForTurn = function () {
        var turnwait = setInterval(function () {
            $.post("http://localhost:8000/turnwaiting", {'player': game.displayplayer.id, 'wantscore': false}, function (data, status) {
                if (!data['resend']) {
                    clearInterval(turnwait);
                    // console.log(game.decree)
                    // console.log(data['decree'])
                    if (game.decree != data['decree']) {
                        game.decree = data['decree'];
                        var decree = `<img src=${game.decree.image} class="card">`;
                        game.buildDecree(decree);
                    }
                    game.trick = data['trick'];
                    // console.log(game.trick)
                    game.playRound()
                }
            })
        }, 5000)
    };

    this.waitForResults = function (suittemp) {
        var turnwait = setInterval(function () {
            $.post("http://localhost:8000/roundwaiting", {'player': game.displayplayer.id, 'wantscore': false}, function (data, status) {
                if (!data['resend']) {
                    clearInterval(turnwait);
                    game.displayplayer.receiveScores(data, suittemp)
                }
            })
        }, 5000)
    };

    this.receiveScores = function (datatemp, suit) {
        console.log(datatemp)
        if (game.decree != datatemp['decree']) {
            game.decree = datatemp['decree'];
            var decree = `<img src=${game.decree.image} class="card">`;
            game.buildDecree(decree);
        }
        console.log("Figuring things out time!")
        if (game.displayplayer.id === datatemp['turn']) {
            console.log("My turn!")
            console.log(game.displayplayer)
            console.log(game.displayplayer.id)
            console.log(datatemp['turn'])
            game.leadplayer = game.displayplayer
            game.followplayer = game.remoteplayer
        } else {
            console.log("Their turn!")
            console.log(game.remoteplayer)
            console.log(game.remoteplayer.id)
            console.log(datatemp['turn'])
            game.leadplayer = game.remoteplayer
            game.followplayer = game.displayplayer
        }
        game.trick = datatemp['trick'];
        player1.tricks = datatemp['player1tricks']
        player1.score = datatemp['player1score']
        player2.tricks = datatemp['player2tricks']
        player2.score = datatemp['player2score']
        game.results.winner = datatemp['result']
        game.displayplayer.buildTrick()
        game.displayplayer.completeRound(suit)
    }

    this.clicked = function (oldcount, x, y) {
        if (!this.isFoxWoodcutter) {
            this.playCard(x, y, oldcount);
            this.resetCards(x)
            this.buildListInactive(oldcount)
            this.buildTrick(oldcount);
        }
        if (game.ai) {
            if (this === game.leadplayer) {
                game.followplayer.followCard()
            }
            game.scoreTrick(game.leadplayer, game.followplayer)
            game.trick = []
            this.completeRound(x)
        } else {
            state = {'decree': game.decree, 'trick': game.trick, 'turn': this.id, 'name': this.name, 'completed': true};
            stateJSON = JSON.stringify(state)
            console.log(state)
            console.log(stateJSON)
            if (game.trick.length === 2) {
                // $.post("http://localhost:8000/roundcompleted", stateJSON, function (data, status) {
                //     game.displayplayer.receiveScores(data, x)
                // })
                $.ajax({
                    url: "http://localhost:8000/roundcompleted",
                    type: "POST",
                    crossDomain: true,
                    data: stateJSON,
                    dataType: "json",
                    contentType: "application/json",
                    success: function (data) {
                        game.displayplayer.receiveScores(data, x)
                    }
                })
            } else {
                $.ajax({
                    url: "http://localhost:8000/turncompleted",
                    type: "POST",
                    crossDomain: true,
                    data: stateJSON,
                    dataType: "json",
                    contentType: "application/json",
                    success: game.displayplayer.waitForResults(x)
                })
                //$.post("http://localhost:8000/turncompleted", stateJSON, game.displayplayer.waitForResults(x))
            }
        }
    }

    this.completeRound = function(suit) {
        if (this.isFoxWoodcutter) {
            this.isFoxWoodcutter = false
        } else {
            this.resetCards(suit)
        }
        if (player1.tricks.length + player2.tricks.length === 13) {
            player1.hand = [];
            player2.hand = [];
            player1.getScores();
            player2.getScores();
            game.whoWinning();
            if (game.gameOver) {
                game.buildScores();
                game.buildDisplayInfo();
                game.buildWinner()
            } else {
                var elem = `trickwinner${game.trickcount}`;
                game.buildResults(elem, game.results.winner, game.trickcount);
                // for (var i; i < this.hand.length; i++) {
                //     for (var j; j < this.hand[i].array.length; j++)
                //         if (!this.hand[i].array[j].playable) {
                //         }
                // }
                document.getElementById(elem).addEventListener("animationend", function () {
                    document.getElementById(elem).style.display = "none";
                    game.gameReset()
                })
            }
        } else {
            game.buildDisplayInfo();
            var elem = `trickwinner${game.trickcount}`;
            game.buildResults(elem, game.results.winner, game.trickcount);
            // for      (var i; i < this.hand.length; i++) {
            //     for (var j; j < this.hand[i].array.length; j++)
            //         if (!this.hand[i].array[j].playable) {
            //         }
            // }
            document.getElementById(elem).addEventListener("animationend", function () {
                document.getElementById(elem).style.display = "none";
                if (game.ai) {
                    game.playRound()
                } else {
                    game.trick = []
                    game.displayplayer.buildTrick()
                    game.start2pTurn(game.leadplayer.id)
                }

            })
        }
    }

    this.setFollowCards = function () {
        if (this.hasSuit()) {
            for (var i = 0; i < this.hand.length; i++) {
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

    this.followCard = function () {
        if (this.hasSuit()) {
            for (var i = 0; i < this.hand.length; i++) {
                if (this.hand[i].suit !== game.trick[0].suit) {
                    this.hand[i].playable = false
                } else {
                    var followsuit = this.hand[i];
                    var x = i
                }
            }
            if (game.trick[0].value === 11) {
                if (followsuit.array[0] === 1) {
                    var y = Math.floor(Math.random() * 2) * (followsuit.array.length - 1)
                } else {
                    var y = followsuit.array.length - 1
                }
            } else {
                var y = Math.floor(Math.random() * followsuit.array.length);
            }
            this.playCard(x, y);
            this.buildTrick(0)
        } else {
            var x = Math.floor(Math.random() * this.hand.length);
            var y = Math.floor(Math.random() * (this.hand[x].array.length));
            this.playCard(x, y);
            this.buildTrick()
        }
    };

    this.resetCards = function (suittemp) {
        for (var i = 0; i < this.hand.length; i++) {
            this.hand[i].playable = true
        }
        if (this.isMonarch || this.isWoodcutter) {
            for (var i = 0; i < this.hand[suittemp].array.length; i++) {
                this.hand[suittemp].array[i].playable = true
            }
            this.isMonarch = false;
            this.isWoodcutter = false
        }
    };

    this.hasSuit = function () {
        for (var i = 0; i < this.hand.length; i++) {
            if (this.hand[i].suit === game.trick[0].suit) {
                if (this.hand[i].array.length > 0) {
                    return true
                }
            }
        }
        return false
    };

    this.getScores = function () {
        var tricks = this.tricks.length;
        var score = 0;
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
                var treasurescore = score + 1;
                this.roundResult = `${this.name} won ${this.tricks.length} tricks, collected 1 treasure, and scored ${treasurescore} points.`
            }
        } else {
            var treasurescore = score + this.treasure;
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

    this.changeName = function (name) {
        this.name = name;
    };

}


function clickedAI() {
    player1 = new Player("Alasdair");
    player2 = new Player("Kaley");
    game = new Game(true, player1, player2);
    document.getElementById("startup").style.display = "none";
    document.getElementById("play").style.display = "block";
    game.buildDisplayInfo();
    game.newRound();
    game.playRound();
}

function clickedHuman() {
    $.post("http://localhost:8000/playerjoin", {'test': "Hello world"}, function(data, status) {
        console.log(data);
        if (data['hand'] === null) {
            player1 = new Player("Alasdair", data['id']);
            player2 = new Player("Kaley");
            var playerwait = setInterval(function() {
                    $.post("http://localhost:8000/playerwaiting", null, function(data, status) {
                        if (!data['resend']) {
                            clearInterval(playerwait);
                            //console.log(data);
                            //console.log("startinggame");
                            player2.id = data['remote']
                            game = new Game(false, player1, player2);
                            game.start2p(data)
                        } else {
                            //console.log("waiting")
                        }
                    })
                },
                5000)
        } else {
            player1 = new Player("Alasdair", data['remote']);
            player2 = new Player("Kaley", data['id']);
            game = new Game(false, player2, player1);
            //console.log("starting game");
            game.start2p(data)
        }
    })
}



var player1;
var player2;
var game;
var state;
const stylesheet = document.documentElement.style



