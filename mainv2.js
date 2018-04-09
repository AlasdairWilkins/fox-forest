function Game() {
    this.decree = 0;
    this.deck = [];
    this.buildDeck = function() {
        var suits = ['Bells', 'Keys', 'Moons'];
        for (var i = 0; i < suits.length; i++) {
            for (var num = 1; num < 12; num++) {
                var card = new Card(num, suits[i]);
                this.deck.push(card);
            }
        }
    };
    this.trick = [];
    this.scoreCheck = 0;
    this.displayplayer = player1;
    this.dealplayer = player1;
    this.leadplayer = player2;
    this.followplayer = player1;
    this.results = {
        lead: "",
        follow: "",
        winner: ""
    }
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
        var decreecard = `The decree card is the ${this.decree.value} of ${this.decree.suit}.`
        document.getElementById("Decree").innerHTML = decreecard
    };

    this.scoreTrick = function() {
        if (this.trick[0].suit === this.trick[1].suit) {
            if (this.trick[0].value > this.trick[1].value) {
                this.makeResults(this.leadplayer)
                this.leadplayer.tricks.push(this.trick)
            } else {
                this.makeResults(this.followplayer)
                this.followplayer.tricks.push(this.trick);
                this.flipPlayers()
            }
        } else {
            if (this.trick[1].suit === this.decree.suit) {
                this.makeResults(this.followplayer)
                this.followplayer.tricks.push(this.trick);
                this.flipPlayers()
            } else {
                this.makeResults(this.leadplayer)
                this.leadplayer.tricks.push(this.trick)
            }
        }
    };

    this.makeResults = function(winner) {
        game.results.lead = `${this.leadplayer.name} played the ${this.trick[0].value} of ${this.trick[0].suit}.`
        game.results.follow = `${this.followplayer.name} played the ${this.trick[1].value} of ${this.trick[1].suit}.`
        game.results.winner = `${winner.name} wins the trick!`
    }

    this.flipPlayers = function() {
        var newfollow = this.leadplayer;
        var newlead = this.followplayer;
        this.leadplayer = newlead;
        this.followplayer = newfollow
    };

    this.buildResults = function() {
        document.getElementById("Lead").innerHTML = game.results.lead
        document.getElementById("Follow").innerHTML = game.results.follow
        document.getElementById("Winner").innerHTML = game.results.winner
    }

    this.playRound = function() {
        if (this.displayplayer !== this.leadplayer) {
            this.leadplayer.leadCard();
            this.displayplayer.setFollowCards();
            this.displayplayer.buildList()
        }
    }

}

function Card(value, suit) {
    this.value = value;
    this.suit = suit;
    this.playable = true;
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
    this.hand = [this.bells, this.keys, this.moons];
    this.tricks = [];
    this.score = 0;

    this.buildTrick = function() {
        var newarray = game.trick.map(function (element) {
            return `<li class=${element.suit} id=${element.value}>${element.value} of ${element.suit}</li>`
        }).join("");
        console.log(document.querySelector('#Trick'));
        document.querySelector('#Trick').innerHTML = newarray;
        // }
    };

    this.buildList = function() {
        for (var i = 0; i < this.hand.length; i++) {
            if (this.hand[i].playable) {
                var newarray = this.hand[i].array.map(function (element) {
                    var y = game.displayplayer.hand[i].array.indexOf(element);
                    return `<button class=${element.suit} id=${element.value} onclick='game.displayplayer.clicked(${i}, ${y})'>${element.value} of ${element.suit}</button>`
                }).join("") } else {
                var newarray = this.hand[i].array.map(function (element) {
                    return `<button class=${element.suit} id=${element.value} disabled>${element.value} of ${element.suit}</button>`
                }).join("")
            }
            document.querySelector(`#${this.hand[i].suit}`).innerHTML = newarray
        }
    };

    this.buildHand = function(decktemp) {
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
        this.bells.array.sort(function(a, b){return a.value - b.value});
        this.keys.array.sort(function(a, b){return a.value - b.value});
        this.moons.array.sort(function(a, b){return a.value - b.value});
        if (this === game.displayplayer) {
            this.buildList()
        }
    };

    this.playCard = function(suittemp, cardtemp) {
        game.trick.push(this.hand[suittemp].array[cardtemp]);
        this.hand[suittemp].array.splice(cardtemp, 1);
        if (this.hand[suittemp].array.length === 0) {
            if (this === game.displayplayer) {
                var element = document.getElementById(this.hand[suittemp].suit);
                element.parentNode.removeChild(element)
            }
            this.hand.splice(suittemp, 1)
        }
    };

    this.leadCard = function() {
        var x = Math.floor(Math.random() * this.hand.length);
        var y = Math.floor(Math.random() * (this.hand[x].array.length));
        this.playCard(x, y);
        this.buildTrick()
    };

    this.clicked = function(x, y) {
        this.playCard(x, y);
        if (game.displayplayer === game.leadplayer) {
            game.followplayer.followCard()
        }
        game.followplayer.resetCards();
        game.scoreTrick(game.leadplayer, game.followplayer);
        game.trick = [];
        game.displayplayer.buildTrick();
        game.displayplayer.buildList();
        game.buildResults();
        if (game.displayplayer.hand.length > 0) {
            game.playRound()
        }
        console.log(this.leadplayer);
        console.log(player1.tricks);
        console.log(player2.tricks)


    };

    this.setFollowCards = function() {
        if (this.hasSuit()) {
            for (var i = 0; i < this.hand.length; i++) {
                if (this.hand[i].suit !== game.trick[0].suit) {
                    this.hand[i].playable = false
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
            var y = Math.floor(Math.random() * followsuit.array.length);
            this.playCard(x, y);
            this.buildTrick()
        } else {
            var x = Math.floor(Math.random() * this.hand.length);
            var y = Math.floor(Math.random() * (this.hand[x].array.length));
            this.playCard(x, y);
            this.buildTrick()
        }
    };


    this.resetCards = function() {
        for (var i = 0; i < this.hand.length; i++) {
            this.hand[i].playable = true
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
}

var player1 = new Player("Alasdair");
var player2 = new Player("Kaley");
var game = new Game();
game.buildDeck();
game.shuffleDeck();
player1.buildHand(game.deck);
player2.buildHand(game.deck);
game.setDecree();
game.playRound();