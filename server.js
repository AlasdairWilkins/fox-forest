function Game(turn) {
    this.decree = 0;
    this.turn = turn
    this.turncompleted = false
    this.roundcompleted = false
    this.deck = [];
    this.buildDeck = function () {
        var suits = ['Bells', 'Keys', 'Moons'];
        for (var i = 0; i < suits.length; i++) {
            for (var num = 1; num < 12; num++) {
                var card = new Card(num, suits[i]);
                if (num % 2 === 1) {
                    card.hasMechanic = true
                    card.mechanic = this.mechanics[Math.floor(num / 2)]
                }
                this.deck.push(card);
            }
        }
    };
    this.leadplayer = player2
    this.followplayer = player1
    this.trick = [];
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
    this.scoreCheck = 0;
    this.hasSwan = false
    this.witchReset = false
    this.setDecree = function() {
        this.decree = this.deck.pop();
        console.log("decree card!")
        console.log(this.decree)
    };
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
    this.flipPlayers = function() {
        var newfollow = this.leadplayer;
        var newlead = this.followplayer;
        this.leadplayer = newlead;
        this.followplayer = newfollow
    };

    this.doWitch = function () {
        var oldsuittemp = "";
        var position = 0;
        if (this.trick[0].value == 9) {
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

    this.makeResults = function (winner) {
        this.results.lead = `${this.leadplayer.name} played the ${this.trick[0].value} of ${this.trick[0].suit}.`;
        this.results.follow = `${this.followplayer.name} played the ${this.trick[1].value} of ${this.trick[1].suit}.`;
        this.results.winner = `${winner.name} wins the trick!`
    };

    this.scoreTrick = function () {
        console.log("At the start of scoring...")
        console.log(this.leadplayer.name)
        if (this.trick[0].value == 9 || this.trick[1].value == 9) {
            if (this.trick[0].value != this.trick[1].value) {
                var olddata = this.doWitch()
            }
        }
        if (this.trick[0].suit == this.trick[1].suit) {
            if (this.trick[0].value > this.trick[1].value) {
                console.log("Lead player will win")
                if (this.witchReset) {
                    this.trick[olddata.position].suit = olddata.suit;
                    this.witchReset = false
                }
                if (this.trick[1].value == 1) {
                    this.hasSwan = true
                }
                this.makeResults(this.leadplayer);
            } else {
                console.log("Follow player will win")
                if (this.witchReset) {
                    this.trick[olddata.position].suit = olddata.suit;
                    this.witchReset = false
                }
                if (this.trick[0].value == 1) {
                    this.hasSwan = true
                }
                this.makeResults(this.followplayer);
                this.flipPlayers()
            }
        } else {
            if (this.trick[1].suit == this.decree.suit) {
                if (this.witchReset) {
                    this.trick[olddata.position].suit = olddata.suit;
                    this.witchReset = false
                }
                if (this.trick[0].value == 1) {
                    this.hasSwan = true
                }
                this.makeResults(this.followplayer);
                this.flipPlayers()
            } else {
                if (this.witchReset) {
                    this.trick[olddata.position].suit = olddata.suit;
                    this.witchReset = false
                }
                if (this.trick[1].value == 1) {
                    this.hasSwan = true
                }
                this.makeResults(this.leadplayer);
            }
        }
        if (this.trick[0].value == 7 || this.trick[1].value == 7) {
            if (this.trick[0].value == this.trick[1].value[1]) {
                this.leadplayer.score += 2;
                this.leadplayer.treasure += 2
            } else {
                this.leadplayer.score += 1;
                this.leadplayer.treasure += 1
            }
        }
        console.log("At the end of scoring...")
        console.log(this.leadplayer.name)
        this.leadplayer.tricks.push(this.trick);
        if (this.hasSwan) {
            this.flipPlayers();
            this.hasSwan = false
        }
    };
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
    this.tricks = []
    this.score = 0

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
        this.hand.push(this.bells, this.keys, this.moons);
        this.handMaster = this.hand.slice(0);
        if (this === game.displayplayer) {
            this.buildList(14)
        }
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

    // this.sendRequest = function () {
    //     var gamesend = JSON.stringify(game);
    //     $.post('http://localhost:8000/sendgamestate', game, function (text, status) {
    //         console.log(text, status);
    //         var newtext = JSON.parse(text);
    //         alert(newtext['hand'][0])
    //         //alert(text['hand'][0])
    //     })
    // }
}


var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors')
var uniqid = require('uniqid');
var app = express();
app.use(bodyParser.json());
app.use(cors())
app.options('*', cors())
// app.use(bodyParser.urlencoded({
//     extended: true
// }));

// this stores game state in a local variable, which will disappear each time you restart
var player1 = null
var player2 = null
var game = null

app.listen(8000, function() {
    console.log('Example app listening on port 8000!');
});

app.post('/playerjoin', function(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    if (player1 === null) {
        player1 = new Player("Alasdair", uniqid())
        res.send({'id': player1.id, 'hand': null})
    } else if (player2 === null) {
        player2 = new Player("Kaley", uniqid())
        game = new Game(player2.id)
        game.buildDeck()
        game.shuffleDeck()
        player1.createHand(game.deck)
        player2.createHand(game.deck)
        game.setDecree(game.deck)
        res.send({'id': player2.id, 'hand': player2.hand, 'decree': game.decree, 'turn': game.turn, 'remote': player1.id})
    } else {
        res.send("Better luck next time!")
    }
})

app.post('/playerwaiting', function(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    console.log("Ahoy hoy")
    if (game === null) {
        res.send({'resend': true, 'wait-message': "Waiting for second player..."})
    } else {
        res.send({'resend': false, 'id': player1.id, 'hand': player1.hand, 'decree': game.decree, 'trick': game.trick, 'turn': game.turn, 'remote': player2.id})

    }
})

app.post('/roundcompleted', function(req, res){
    res.setHeader('Access-Control-Allow-Origin', '*')
    // res.setHeader('Access-Control-Allow-Methods: POST')
    // res.setHeader('Access-Control-Allow-Headers: content-type')
    console.log("What's all this then")
    console.log(req.body)
    game.decree = req.body['decree']
    game.trick = req.body['trick']
    game.turn = req.body['turn']
    if (game.turn === player1.id) {
        // console.log("Player 1 followed!")
        game.leadplayer = player2
        game.followplayer = player1
    } else {
        // console.log("Player 2 followed!")
        game.leadplayer = player1
        game.followplayer = player2
    }
    game.scoreTrick(game.leadplayer, game.followplayer)
    game.turn = game.leadplayer.id
    game.roundcompleted = true
    // console.log({'decree': game.decree, 'trick': game.trick, 'turn': game.turn, 'result': game.results.winner,
    //     'player1': player1.id, 'player1tricks': player1.tricks, 'player1score': player1.score,
    //     'player2': player2.id, 'player2tricks': player2.tricks, 'player2score': player2.score})
    res.send({'decree': game.decree, 'trick': game.trick, 'turn': game.turn, 'result': game.results.winner,
        'player1': player1.id, 'player1tricks': player1.tricks, 'player1score': player1.score,
        'player2': player2.id, 'player2tricks': player2.tricks, 'player2score': player2.score})
})

app.post('/turncompleted', function(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    // res.setHeader('Access-Control-Allow-Methods: POST')
    // res.setHeader('Access-Control-Allow-Headers: content-type')
    // console.log("Haaaaaaaaaiiiiiiiii")
    console.log(req.body)
    game.decree = req.body['decree']
    game.trick = req.body['trick']
    game.turn = req.body['turn']
    if (game.turn === player1.id) {
        game.turn = player2.id
    } else {
        game.turn = player1.id
    }
    game.turncompleted = true
})

app.post('/roundwaiting', function(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    if (game.roundcompleted) {
        game.roundcompleted = false
        res.send({'resend': false, 'decree': game.decree, 'trick': game.trick, 'turn': game.turn, 'result': game.results.winner,
            'player1': player1.id, 'player1tricks': player1.tricks, 'player1score': player1.score,
            'player2': player2.id, 'player2tricks': player2.tricks, 'player2score': player2.score})
        game.trick = []
        // console.log("Reset!")
        // console.log(game.trick)
    } else {
        res.send({'resend': true})
    }
})

app.post('/turnwaiting', function(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    // console.log("Hi hi hi")
    if (game.turncompleted) {
        game.turncompleted = false
        res.send({'resend': false, 'decree': game.decree, 'trick': game.trick, 'turn': game.turn})
    } else {
        res.send({'resend': true})
    }
})

app.post('/woodcutterdraw', function(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    var card = game.deck.pop()
    res.send({'newcard': card})
})

app.post('/woodcutterdiscard', function(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    var discard = req.body('discard')
    game.deck.splice(0, 0, discard)
})
//
// app.post('/newround', function(req, res) {
//     res.setHeader('Access-Control-Allow-Origin', '*')
//     console.log("Yay! Keep playing!")
//     deck = []
//     game.flipPlayers()
//     game.buildDeck()
//     game.shuffleDeck()
//     player1.createHand(game.deck)
//     player2.createHand(game.deck)
//     game.setDecree()
//     state.turn = game.leadplayer
//     if (res.body === player1.id) {
//         res.send({'id': player1.id, 'hand': player1.hand, 'decree': state.decree, 'trick': state.trick, 'whoseturn': state.turn})
//     } else {
//         res.send({'id': player2.id, 'hand': player2.hand, 'decree': state.decree, 'trick': state.trick, 'whoseturn': state.turn})
//     }
// })
