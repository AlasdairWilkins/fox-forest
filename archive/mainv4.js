function Game() {
    this.decree = 0;
    this.deck = [];
    this.buildDeck = function() {
        var suits = ['Bells', 'Keys', 'Moons'];
        for (var i = 0; i < suits.length; i++) {
            for (var num = 1; num < 12; num++) {
                var card = new Card(num, suits[i]);
                if (num%2 === 1) {
                    card.hasMechanic = true
                    card.mechanic = this.mechanics[Math.floor(num/2)]
                }
                this.deck.push(card);
            }
        }
    };
    this.trick = [];
    this.scoreCheck = 0;
    this.displayplayer = player1;
    this.dealplayer = player2;
    this.leadplayer = player1;
    this.followplayer = player2;
    this.currentWinner = ""
    this.results = {
        lead: "",
        follow: "",
        winner: ""
    };
    this.swan = `Swan: If you play this and lose the trick, you lead the next trick.`
    this.fox = `Fox: When you play this, you may exchange the decree card with a card from your hand.`
    this.woodcutter = `Woodcutter: When you play this, draw 1 card. Then discard any 1 card to the bottom of the deck.`
    this.treasure = `Treasure: The winner of the trick receives 1 point for each 7 in the trick.`
    this.witch = `Witch: When determining the winner of a trick with only one 9, treat the 9 as if it were in the trump suit.`
    this.monarch = `Monarch: When you lead this, if your opponent has any cards of the same suit, they must play either the 1 or their highest card from that suit.`
    this.mechanics = [this.swan, this.fox, this.woodcutter, this.treasure, this.witch, this.monarch]
    this.witchReset = false
    this.hasSwan = false
    this.gameOver = false
    this.winner = ''
    this.shuffleDeck = function() {
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
    this.setDecree = function() {
        this.decree = this.deck.pop();
        var decree = `The decree card is the ${this.decree.value} of ${this.decree.suit}.`
        this.buildDecree(decree)
    }

    this.buildDecree = function(decreetemp) {
        document.getElementById("Decree").innerHTML = decreetemp
    };

    this.whoLeads = function() {
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
            this.gameOver = true
            if (player1.score > player2.score) {
                this.winner = `${player1.name} wins!`
            } else {
                this.winner = `${player2.name} wins!`
            }
        }

    }



    this.doWitch = function() {
        var oldsuittemp = ""
        var position = 0
        if (this.trick[0].value === 9) {
            oldsuittemp = this.trick[0].suit
            this.trick[0].suit = game.decree.suit
        } else {
            oldsuittemp = this.trick[1].suit
            position = 1
            this.trick[1].suit = game.decree.suit
        }
        this.witchReset = true
        return {
            suit: oldsuittemp,
            position: position
        }
    }


    this.scoreTrick = function() {
        if (this.trick[0].value === 9 || this.trick[1].value === 9) {
            if (this.trick[0].value !== this.trick[1].value) {
            console.log("Witch time!")
            var olddata = this.doWitch()
            }
        }
        if (this.trick[0].suit === this.trick[1].suit) {
            if (this.trick[0].value > this.trick[1].value) {
                if (this.witchReset) {
                    this.trick[olddata.position].suit = olddata.suit
                    this.witchReset = false
                }
                if (this.trick[1].value === 1) {this.hasSwan = true}
                this.makeResults(this.leadplayer);
            } else {
                if (this.witchReset) {
                    this.trick[olddata.position].suit = olddata.suit
                    this.witchReset = false
                }
                if (this.trick[0].value === 1) {this.hasSwan = true}
                this.makeResults(this.followplayer);
                this.flipPlayers()
            }
        } else {
            if (this.trick[1].suit === this.decree.suit) {
                if (this.witchReset) {
                    this.trick[olddata.position].suit = olddata.suit
                    this.witchReset = false
                }
                if (this.trick[0].value === 1) {this.hasSwan = true}
                this.makeResults(this.followplayer);
                this.flipPlayers()
            } else {
                if (this.witchReset) {
                    this.trick[olddata.position].suit = olddata.suit
                    this.witchReset = false
                }
                if (this.trick[1].value === 1) {this.hasSwan = true}
                this.makeResults(this.leadplayer);
            }
        }
        if (this.trick[0].value === 7 || this.trick[1].value === 7) {
            if (this.trick[0].value === this.trick[1].value[1]) {
                this.leadplayer.score += 2
                this.leadplayer.treasure += 2
            } else {
                this.leadplayer.score += 1
                this.leadplayer.treasure += 1
            }
        }
        this.leadplayer.tricks.push(this.trick)
        if (this.hasSwan) {
            this.flipPlayers()
            this.hasSwan = false
        }
    };

    this.makeResults = function(winner) {
        this.results.lead = `${this.leadplayer.name} played the ${this.trick[0].value} of ${this.trick[0].suit}.`;
        this.results.follow = `${this.followplayer.name} played the ${this.trick[1].value} of ${this.trick[1].suit}.`;
        this.results.winner = `${winner.name} wins the trick!`
    };

    this.flipPlayers = function() {
        var newfollow = this.leadplayer;
        var newlead = this.followplayer;
        this.leadplayer = newlead;
        this.followplayer = newfollow
    };

    this.buildScores = function() {
        document.getElementById("Last Round").innerHTML = `As of the last round:`
        document.getElementById("Player 1 Tricks").innerHTML = player1.roundResult
        document.getElementById("Player 2 Tricks").innerHTML = player2.roundResult
        document.getElementById("Score Update").innerHTML = this.currentWinner
    }

    this.buildWinner = function() {
        document.getElementById("Game Over").innerHTML = this.winner
    }


    this.buildResults = function() {
        document.getElementById("Lead").innerHTML = this.results.lead;
        document.getElementById("Follow").innerHTML = this.results.follow;
        document.getElementById("Winner").innerHTML = this.results.winner
    };

    this.buildMechanic = function(mechanic) {
        document.getElementById("Mechanic").innerHTML = mechanic
    }

    this.playRound = function() {
        if (this.displayplayer !== this.leadplayer) {
            this.leadplayer.leadCard();
            this.displayplayer.setFollowCards();
            this.displayplayer.buildList()
        }
    };

    this.newRound = function() {
        this.deck = [];
        this.buildDeck();
        this.shuffleDeck();
        this.resetPlayers();
        this.followplayer.createHand(this.deck);
        this.leadplayer.createHand(this.deck);
        game.setDecree();
    };

    this.resetPlayers = function() {
        if (player1 === this.dealplayer) {
            this.dealplayer = player2
            this.leadplayer = player1
            this.followplayer = player2
        } else {
            this.dealplayer = player1
            this.leadplayer = player2
            this.followplayer = player1
        }
    }

    this.doMonarch = function(suit) {
        for (var i = 0; i < this.followplayer.hand[suit].array.length; i++) {
            if (this.followplayer.hand[suit].array[i].value === 1) {
                this.followplayer.hand[suit].array[i].playable = true
            } else if (i === this.followplayer.hand[suit].array.length - 1) {
                this.followplayer.hand[suit].array[i].playable = true
            } else {
                this.followplayer.hand[suit].array[i].playable = false
            }
        }
    }

}

function Card(value, suit) {
    this.value = value;
    this.suit = suit;
    this.playable = true;
    this.hasMechanic = false;
    this.mechanic = 0
}

function Player(name) {
    this.name = name;
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
    this.isFoxWoodcutter = false
    this.isWoodcutter = false
    this.isMonarch = false
    this.roundResult = '';

    this.buildTrick = function () {
        var newarray = game.trick.map(function (element) {
            return `<li class=${element.suit} id=${element.value}>${element.value} of ${element.suit}</li>`
        }).join("");
        document.querySelector('#Trick').innerHTML = newarray
    };

    this.buildWoodcutterList = function () {
        for (var i = 0; i < this.hand.length; i++) {
            var newarray = this.hand[i].array.map(function (element) {
                var z = game.displayplayer.hand[i].array.indexOf(element);
                if (element.playable) {
                    return `<button class=${element.suit} id=${element.value} onclick='game.displayplayer.doWoodcutter(${i}, ${z})'>${element.value} of ${element.suit}</button>`
                } else {
                    return `<button class=${element.suit} id=${element.value} disabled>${element.value} of ${element.suit}</button>`
                }
            }).join("")
            document.querySelector(`#${this.hand[i].suit}`).innerHTML = newarray
        }
    }

    this.buildFoxList = function () {
        for (var i = 0; i < this.hand.length; i++) {
            var newarray = this.hand[i].array.map(function (element) {
                var z = game.displayplayer.hand[i].array.indexOf(element);
                return `<button class=${element.suit} id=${element.value} onclick='game.displayplayer.doFox(${i}, ${z})'>${element.value} of ${element.suit}</button>`
            }).join("")
            document.querySelector(`#${this.hand[i].suit}`).innerHTML = newarray
        }
    }

    this.buildPassButton = function (passhtml) {
        document.getElementById("Pass").innerHTML = passhtml
    }

    this.buildList = function () {
        var tricksplayed = player1.tricks.length + player2.tricks.length
        for (var i = 0; i < this.hand.length; i++) {
            if (this.hand[i].playable) {
                var newarray = this.hand[i].array.map(function (element) {
                    var y = game.displayplayer.hand[i].array.indexOf(element);
                    if (element.playable) {
                        if (element.value === 3 && tricksplayed < 12) {
                            return `<button class=${element.suit} id=${element.value} onclick='game.displayplayer.doFoxHuman(${i}, ${y})'>${element.value} of ${element.suit}</button>`
                        } else if (element.value === 5 && tricksplayed < 12) {
                            return `<button class=${element.suit} id=${element.value} onclick='game.displayplayer.doWoodcutterHuman(${i}, ${y})'>${element.value} of ${element.suit}</button>`
                        } else {
                            return `<button class=${element.suit} id=${element.value} onclick='game.displayplayer.clicked(${i}, ${y})'>${element.value} of ${element.suit}</button>`
                        }
                    } else {
                        return `<button class=${element.suit} id=${element.value} disabled>${element.value} of ${element.suit}</button>`
                    }
                }).join("")
            } else {
                var newarray = this.hand[i].array.map(function (element) {
                    return `<button class=${element.suit} id=${element.value} disabled>${element.value} of ${element.suit}</button>`
                }).join("")
            }
            document.querySelector(`#${this.hand[i].suit}`).innerHTML = newarray
        }
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
        this.hand.push(this.bells, this.keys, this.moons)
        this.handMaster = this.hand.slice(0)
        if (this === game.displayplayer) {
            this.buildList()
        }
    };

    this.insertCard = function(card) {
        for (var i = 0; i < 3; i++) {
            if (card.suit === this.handMaster[i].suit) {
                this.handMaster[i].array.push(card)
                this.handMaster[i].array.sort(function (a, b) {
                    return a.value - b.value
                });
                this.hand = this.handMaster.slice(0)
                for (var j = 2; j >= 0; j--) {
                    if (this.hand[j].array.length === 0) {
                        this.hand.splice(j, 1)
                    }
                }
            }
        }
    }

    this.doFox = function(suit, value) {
        var newcard = game.decree
        game.decree = this.hand[suit].array[value]
        var decree = `${this.name} changed the decree card to the ${game.decree.value} of ${game.decree.suit}.`
        game.buildDecree(decree)
        this.hand[suit].array.splice(value, 1)
        this.insertCard(newcard)
        if (this === game.displayplayer) {
            var passbutton = ""
            this.buildPassButton(passbutton)
            this.clicked()
        }
    }

    this.doWoodcutter = function(suit, value) {
        var discard = this.hand[suit].array[value]
        this.hand[suit].array.splice(value, 1)
        game.deck.splice(0, 0, discard)
        if (this === game.displayplayer) {
            this.clicked()
        }
    }

    this.passFox = function (suit, value) {
        var passbutton = ''
        this.buildPassButton(passbutton)
        this.clicked(suit, value)
    }

    this.doFoxHuman = function(suit, value) {
        this.isFoxWoodcutter = true
        this.playCard(suit, value)
        if (game.displayplayer === game.followplayer) {
            this.resetCards(suit);
        }
        this.buildFoxList(suit, value)
        var passbutton = `<button onclick='game.displayplayer.passFox(${suit}, ${value})'>Keep the current decree card</button>`
        this.buildPassButton(passbutton)
    }

    this.doWoodcutterHuman = function(suit, value) {
        this.isFoxWoodcutter = true
        this.playCard(suit, value)
        if (game.displayplayer === game.followplayer) {
            this.resetCards(suit);
        }
        var newcard = game.deck.pop()
        newcard.playable = false
        this.insertCard(newcard)
        this.buildWoodcutterList(suit, value)
        newcard.playable = true
    }

    this.doFoxAI = function() {
        if (Math.floor(Math.random()*2) === 1) {
            var x = Math.floor(Math.random()*this.hand.length)
            var y = Math.floor(Math.random()*this.hand[x].array.length)
            this.doFox(x, y, "", 0)
        }
    }

    this.doWoodcutterAI = function() {
        var x = Math.floor(Math.random()*this.hand.length)
        var y = Math.floor(Math.random()*this.hand[x].array.length)
        var discard = this.hand[x].array[y]
        this.hand[x].array.splice(y, 1)
        game.deck.splice(0, 0, discard)
        var newcard = game.deck.pop()
        this.insertCard(newcard)
    }

    this.playCard = function(suittemp, cardtemp) {
        game.trick.push(this.hand[suittemp].array[cardtemp]);
        var tricknum = game.trick.length - 1
        console.log(this.hand[suittemp].array[cardtemp])
        if (this.hand[suittemp].array[cardtemp].hasMechanic) {
            game.buildMechanic(this.hand[suittemp].array[cardtemp].mechanic)
        }
        this.hand[suittemp].array.splice(cardtemp, 1);
        if (this.hand[suittemp].array.length === 0) {
            if (this === game.displayplayer) {
                this.buildList()
            }
            this.hand.splice(suittemp, 1)
            this.isMonarch = false
        }
        if (this.hand.length > 0) {
            if (game.trick[tricknum].value === 3) {
                if (this !== game.displayplayer) {
                    this.doFoxAI()
                }
            }
            if (game.trick[tricknum].value === 5) {
                if (this !== game.displayplayer) {
                    //console.log(this.hand)
                    this.doWoodcutterAI()
                    //console.log(this.hand)
                }
            }
        }

    };

    this.leadCard = function() {
        var x = Math.floor(Math.random() * this.hand.length);
        var y = Math.floor(Math.random() * (this.hand[x].array.length));
        this.playCard(x, y);
        this.buildTrick()
        if (game.trick[0].value === 11) {
            game.displayplayer.isMonarch = true
        }
    };

    this.clicked = function(x, y) {
        if (!this.isFoxWoodcutter) {
            this.playCard(x, y);
        }
        if (this === game.leadplayer) {
            game.followplayer.followCard()
        }
        if (this.isFoxWoodcutter) {
            this.isFoxWoodcutter = false
        } else {
            this.resetCards(x)
        }
        game.scoreTrick(game.leadplayer, game.followplayer);
        game.trick = [];
        if (this.hand.length === 0) {
            player1.getScores();
            player2.getScores();
            game.whoLeads();
            if (game.gameOver) {
                game.buildScores()
                game.buildWinner()
            } else {
                game.buildScores();
                game.newRound();
                this.buildTrick();
                this.buildList();
                game.playRound()
            }
        } else {
            this.buildTrick();
            this.buildList();
            game.buildResults();
            for (var i; i < this.hand.length; i++) {
                for (var j; j < this.hand[i].array.length; j++)
                    if (!this.hand[i].array[j].playable) {
                    console.log(this.hand[i].array[j].suit, this.hand[i].array[j].value)
                    }
            }
            console.log("All clear!")
            game.playRound()
        }

    };

    this.setFollowCards = function() {
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

    this.followCard = function() {
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
            this.buildTrick()
        } else {
            var x = Math.floor(Math.random() * this.hand.length);
            var y = Math.floor(Math.random() * (this.hand[x].array.length));
            this.playCard(x, y);
            this.buildTrick()
        }
    };
    
    this.resetCards = function(suittemp) {
        for (var i = 0; i < this.hand.length; i++) {
            this.hand[i].playable = true
        }
        if (this.isMonarch || this.isWoodcutter) {
            for (var i = 0; i < this.hand[suittemp].array.length; i++) {
                this.hand[suittemp].array[i].playable = true
            }
            this.isMonarch = false
            this.isWoodcutter = false
        }
    };

    this.hasSuit = function() {
        for (var i = 0; i < this.hand.length; i++) {
            if (this.hand[i].suit === game.trick[0].suit) {
                if (this.hand[i].array.length > 0) {
                    return true
                }
            }
        }
        return false
    }

    this.getScores = function() {
        var tricks = this.tricks.length
        var score = 0
        if (tricks <= 3) {
            score = 6
        } else if (tricks === 4) {
            score = 1
        } else if (tricks === 5) {
            score = 2
        } else if (tricks === 6) {
            score += 3
        } else if (7 <= tricks && tricks <= 9) {
            score +=6
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
                var treasurescore = score + 1
                this.roundResult = `${this.name} won ${this.tricks.length} tricks, collected 1 treasure, and scored ${treasurescore} points.`
            }
        } else {
            var treasurescore = score + this.treasure
            if (tricks === 1) {
                this.roundResult = `${this.name} won 1 trick, collected ${this.treasure} treasures, and scored ${treasurescore} points.`
            } else {
                this.roundResult = `${this.name} won ${this.tricks.length} tricks, collected ${this.treasure} treasures, and scored ${treasurescore} points.`
            }
        }
        this.score += score
        this.treasure = 0
        this.tricks = []
    }
}

var player1 = new Player("Alasdair");
var player2 = new Player("Kaley");
var game = new Game();
game.newRound();
game.playRound();