function Gameroom (choice, socket, cookie) {
    this.twoplayer = choice
    this.p1socket = socket
    this.p1cookie = cookie
    this.p2socket = null
    this.p2cookie = null
    this.state = null
}

function State(player1, player2, round, game) {
    this.player1 = player1
    this.player2 = player2
    this.id = game.id
    this.deal = round.dealplayer.id
    this.decree = round.decree
    this.deck = round.deck
    this.trick = []
    this.turn = round.receiveplayer.id
}

State.prototype.update = function () {
    trick.winner.wonLast = true
    trick.loser.wonLast = false
    if (trick.hasSwan) {
        trick = new Trick(trick.loser, trick.winner)
    } else {
        trick = new Trick(trick.winner, trick.loser)
    }
    state.turn = trick.leadplayer.id
}

function Round(dealplayer, receiveplayer) {
    this.decree = null
    this.deck = []
    this.dealplayer = dealplayer;
    this.receiveplayer = receiveplayer
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
};

Round.prototype.start = function () {
    round.createDeck()
    round.shuffleDeck()
    player1.createHand()
    player2.createHand()
    round.setDecree()
    trick = new Trick(round.receiveplayer, round.dealplayer)
    state = new State(player1, player2, round, game)
    return state
}

function Trick(leadplayer, followplayer) {
    this.cards = []
    this.leadplayer = leadplayer
    this.followplayer = followplayer
    this.winner = null;
    this.witchReset = false;
    this.hasSwan = false;
    this.loser = null
}

Trick.prototype.doWitch = function () {
    let oldsuittemp = "";
    let position = 0;
    if (trick.cards[0].value === 9) {
        oldsuittemp = trick.cards[0].suit;
        trick.cards[0].suit = state.decree.suit
    } else {
        oldsuittemp = trick.cards[1].suit;
        position = 1;
        trick.cards[1].suit = state.decree.suit
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
        if (trick.cards[1].suit === state.decree.suit) {
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

function Game(choice, id) {
    this.ai = choice
    this.id = id
    this.swan = `Swan: If you play this and lose the trick, you lead the next trick.`;
    this.fox = `Fox: When you play this, you may exchange the decree card with a card from your hand.`;
    this.woodcutter = `Woodcutter: When you play this, draw 1 card. Then discard any 1 card to the bottom of the deck.`;
    this.treasure = `Treasure: The winner of the trick receives 1 point for each 7 in the trick.`;
    this.witch = `Witch: When determining the winner of a trick with only one 9, treat the 9 as if it were in the trump suit.`;
    this.monarch = `Monarch: When you lead this, if your opponent has any cards of the same suit, they must play either the 1 or their highest card from that suit.`;
    this.mechanics = [this.swan, this.fox, this.woodcutter, this.treasure, this.witch, this.monarch];
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
    this.wonLast = false
    this.roundResult = null;
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

Player.prototype.createHand = function () {
    for (let i = 0; i < 13; i++) {
        let newcard = round.deck.pop();
        this.hand.push(newcard)
    }
    this.sortHand()
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

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const uniqid = require('uniqid');
const app = express();
const util = require('util')
const fs = require('fs')
const http = require('http').Server(app);
const io = require('socket.io')(http);
const nodemailer = require('nodemailer');
const cookieParser = require('cookie-parser')
const request = require('request')

app.use(express.static('public'))
app.use(cookieParser())

app.get('/', function(req, res){
    if (!req.cookies.id) {
        let cookie = uniqid()
        res.setHeader('Set-Cookie', 'id=' + cookie)
    }
    res.sendFile(__dirname + '/main.html')
    console.log('here comes a user');
});

io.on('connection', function(socket){
    let cookie = parseCookie(socket.request.headers.cookie).id
    console.log(players)

    if (players[cookie]) {
        //resume first game in array
        let gameroom = players[cookie][0]
        let game = games[gameroom]
        console.log('Game ID', gameroom)
        console.log("Resumable game", game)
        if (cookie === game.p1cookie && !game.p1socket) {
            game.p1socket = socket.id
            socket.join(gameroom)
            console.log("This is player 1!", game)
            console.log("What will be sent:", game.state)
            let startup = {'twoplayer': game.twoplayer, 'state': game.state}
            socket.emit("resumegame", startup)
        } else if (cookie === game['p2cookie'] && !game['p2socket']) {
            game.p2socket = socket.id
            socket.join(gameroom)
            console.log("This is player 2!", game)
            console.log("What will be sent:", game.state)
            let startup = {'twoplayer': game.twoplayer, 'state': game.state}
            socket.emit("resumegame", startup)
        } else {
            console.log("That's an error!")
        }
    }

    console.log('a user connected', socket.id, cookie);

    let referer = socket.request.headers.referer
    let query = referer.substr(url.length)
    if (query.substr(0, 5) === '?code') {
        let code = query.substr(6)
        start2p(code, socket)
    }

    socket.on('1pgame', function(msg){
        gameroom = uniqid()
        newPlayer(gameroom, socket, false)
        nameAIPlayer(gameroom, socket)
    })

    socket.on('2pgame', function(msg){
        gameroom = uniqid()
        newPlayer(gameroom, socket, true)
        socket.emit('gamecode', gameroom)
    })

    socket.on('sendcode', function(msg){
        let link = `http://localhost:8000/?code=${msg.gameroom}`
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'alasdairprograms@gmail.com',
                pass: 'h0p3&j0y'
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        let mailOptions = {
            to: msg.email,
            subject: "Here's your game code",
            text: `${msg.gameroom} or go to ${link}`,
            html: `<a href='${link}'>${link}</a>`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        });
    })

    socket.on('startgame', function(msg){
        if (games[msg].p1socket) {
            start2p(msg, socket)
        }

    })

    socket.on('turncompleted', function(msg){
        trick.leadplayer.hand = msg.hand
        if (state.decree !== msg.decree) {
            state.decree = msg.decree
        }
        state.trick = msg.trick
        if (msg.turn === state.player1.id) {
            state.turn = state.player2.id
        } else {
            state.turn = state.player1.id
        }
        console.log("Mid-trick update:", state)
        //update gameroom's state information for reload here
        socket.to(gameroom).emit('turninfo', msg)
    })

    socket.on('trickcompleted', function(msg) {
        state.decree = msg.decree
        state.trick = msg.trick
        trick.followplayer.hand = msg.hand
        state.turn = msg.turn
        trick.cards = msg.trick
        if (state.turn === player1.id) {
            game.leadplayer = player2
            game.followplayer = player1
        } else {
            game.leadplayer = player1
            game.followplayer = player2
        }
        trick.score(game.leadplayer, game.followplayer)
        state.update()
        io.in(gameroom).emit('trickresults', state)
    })

    socket.on('roundcompleted', function() {
        player1.getScores()
        player2.getScores()
        scores = {
            'p1score': player1.score,
            'p1result': player1.roundResult,
            'p2score': player2.score,
            'p2result': player2.roundResult
        }
        io.in(gameroom).emit('roundresults', scores)
    })

    socket.on('updatestate', function (msg) {
        let game = games[msg.id]
        game.state = msg
    })

    //FIX THIS!!!!! ------>>>>>

    socket.on('roundstartup', function() {
        player1.hand = []
        player2.hand = []
        if (round.dealplayer.id === player1.id) {
            round = new Round(player2, player1)
        } else {
            round = new Round(player1, player2)
        }
        state = round.start()
        io.in(gameroom).emit('newround', state)
    })

    socket.on('woodcutter', function(msg){
        var discard = msg['discard']
        round.deck.splice(0, 0, discard)
    })

    socket.on('disconnect', function(){
        if (players[cookie]) {
            for (let i = 0; i < players[cookie].length; i++) {
                let game = games[players[cookie][i]]
                if (socket.id === game['p1socket']) {
                    game['p1socket'] = null
                } else {
                    game['p2socket'] = null
                }
            }
        }
        console.log('a user disconnected');
        console.log(socket.id, cookie)
    });
});

function start1p(gameroom, socket, name) {
    games[gameroom]['p2socket'] = socket.id
    newPlayer(gameroom, socket)
    player1 = new Player('Alasdair', games[gameroom]['p1cookie'])
    player2 = new Player(name, 'computer')
    startGame(false, gameroom)
}

function startGame(choice, gameroom) {
    game = new Game(choice, gameroom)
    round = new Round(player1, player2)
    state = round.start()
    games[gameroom]['state'] = state
    let startup = {'twoplayer': games[gameroom].twoplayer, 'state': state}
    console.log(startup)
    io.to(gameroom).emit('startupinfo', startup)
}

function start2p(gameroom, socket) {
    games[gameroom]['p2socket'] = socket.id
    newPlayer(gameroom, socket)
    player1 = new Player('Alasdair', games[gameroom]['p1cookie'])
    player2 = new Player('Kaley', games[gameroom]['p2cookie'])
    startGame(true, gameroom)
}

function newPlayer(gameroom, socket, choice) {
    let newcookie = parseCookie(socket.request.headers.cookie).id
    if (!games[gameroom]) {
        games[gameroom] = new Gameroom(choice, socket.id, newcookie)
    } else {
        if (games[gameroom].twoplayer) {
            games[gameroom].p2socket = socket.id
            games[gameroom].p2cookie = newcookie
        } else {
            games[gameroom].p2socket = 'computer'
            games[gameroom].p2cookie = 'computer'
        }
    }
    if (!players[newcookie]) {
        players[newcookie] = [gameroom]
    } else {
        players[newcookie].push(gameroom)
    }
    socket.join(gameroom)

}

function nameAIPlayer(gameroom, socket) {
    fs.readFile('./names.json', 'utf8', function(err, data) {
        let json = JSON.parse(data)
        let names = json['names']
        let num = Math.floor(Math.random() * 202)
        let name = names[num]
        start1p(gameroom, socket, name)
    })
}

function parseCookie(cookie) {
    cookie = cookie.split("; ").join(";")
    cookie = cookie.split(" =").join("=")
    cookie = cookie.split(";")

    let object = {}
    for (let i = 0; i < cookie.length; i++) {
        cookie[i] = cookie[i].split("=");
        object[cookie[i][0]] = decodeURIComponent(cookie[i][1])
    }
    return object

}

http.listen(8000, function() {
    console.log('Example app listening on port 8000!');
});

app.post('/codesent', function(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    console.log(req.body)
})

app.post('/woodcutterdraw', function(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    var card = round.deck.pop()
    res.send({'newcard': card})
})

app.post('/computername', function(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    fs.readFile('./names.json', 'utf8', function(err, data) {
        let json = JSON.parse(data)
        let names = json['names']
        let num = Math.floor(Math.random() * 202)
        let name = names[num]
        res.send({'name': name})
    })
})

let player1 = null
let player2 = null
let game = null
let round = null
let trick = null
let games = {}
let gameroom = null
let state = null
let scores = null
let jsonstate = null
let players = {}
let connected = false
const suits = ['Bells', 'Keys', 'Moons']
const url = 'http://localhost:8000/'