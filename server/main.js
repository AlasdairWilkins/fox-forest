const Player = require("./player")
const Card = require("./card")
const Trick = require("./trick")

const url = 'http://localhost:8000/'
// const url = 'http://fox-forest.alasdairwilkins.com/'

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const shortid = require('shortid');
const app = express();
const util = require('util')
const fs = require('fs')
const http = require('http').Server(app);
const io = require('socket.io')(http);
const nodemailer = require('nodemailer');
const cookieParser = require('cookie-parser')
const request = require('request')
const Promise = require('bluebird')
const rp = require('request-promise')

//https://www.recurse.com/settings/apps

const credentials = {
    client: {
        //development
        id: 'fe8bb8dba4ab9d66bfc19544d4fba61a453492c0c437ee1c6890996e9c9b26ac',
        secret: 'faa0e825b09c5a155115261a0fb81f97524b583f4c4413d0487799ac43088342'

        //production
        // id: '0b974ddeacd24f0b30a60738d27c8121c8bacc6cf38d0d79916275b5a9eb5952',
        // secret: 'd270c15a97785250da3fe03fd8c1677ab8434090dd5ef08a5f8237f09f38c64a'
    },
    auth: {
        tokenHost: 'https://www.recurse.com'
    }
};
const oauth2 = require('simple-oauth2').create(credentials);
const authorizationUri = oauth2.authorizationCode.authorizeURL({
    redirect_uri: 'http://localhost:8000/login'
    // redirect_uri: 'http://fox-forest.alasdairwilkins.com/login',
});

// this is such a problem, SOLVE IT!!!

let player1 = null
let player2 = null
let round = null
let trick = null
let gameroom = null
let state = null
let scores = null

const suits = ['Bells', 'Keys', 'Moons']

function Game(choice, p1cookie, p1socket, p2cookie, p2socket) {

    this.twoplayer = choice
    this.deck = this.createDeck()
    this.player1 = new Player(this.deck, active[p1cookie].name, active[p1cookie].id, p1cookie, p1socket)
    this.player2 = choice ? new Player(this.deck, active[p2cookie].name, active[p2cookie].id, p2cookie, p2socket) : new Player(this.deck)
    this.round = new Round(this.player1, this.player2, this.deck)
    // this.state = new State(this.player1, this.player2, this.round, this.deck)
// }

// function Game(choice, id) {
//     this.ai = choice
//     this.id = id
//     //WORTH MOVING THIS OUT OF HERE INTO A CONSTANT
//     this.swan = `Swan: If you play this and lose the trick, you lead the next trick.`;
//     this.fox = `Fox: When you play this, you may exchange the decree card with a card from your hand.`;
//     this.woodcutter = `Woodcutter: When you play this, draw 1 card. Then discard any 1 card to the bottom of the deck.`;
//     this.treasure = `Treasure: The winner of the trick receives 1 point for each 7 in the trick.`;
//     this.witch = `Witch: When determining the winner of a trick with only one 9, treat the 9 as if it were in the trump suit.`;
//     this.monarch = `Monarch: When you lead this, if your opponent has any cards of the same suit, they must play either the 1 or their highest card from that suit.`;
//     this.mechanics = [this.swan, this.fox, this.woodcutter, this.treasure, this.witch, this.monarch];
//     this.gameOver = false; //game? or possibly round
//     this.winner = ''; //game
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

function State(player1, player2, round, deck) {
    this.player1 = player1
    this.player2 = player2
    // this.id = game.id
    this.deal = round.dealplayer.id
    this.decree = round.decree
    this.deck = deck
    this.trick = []
    this.turn = round.receiveplayer.id
}

// State.prototype.update = function () {
//     trick.winner.wonLast = true
//     trick.loser.wonLast = false
//     if (trick.hasSwan) {
//         trick = new Trick(trick.loser, trick.winner)
//     } else {
//         trick = new Trick(trick.winner, trick.loser)
//     }
//     this.turn = trick.leadplayer.id
// }

function Round(dealplayer, receiveplayer, deck) {
    this.decree = this.setDecree(deck)
    this.dealplayer = dealplayer;
    this.receiveplayer = receiveplayer
    this.trick = new Trick(this.receiveplayer, this.dealplayer)
}

Game.prototype.createDeck = function () {
    let deck = []
    for (let i = 0; i < suits.length; i++) {
        for (let num = 1; num < 12; num++) {
            let card = new Card(num, suits[i]);
            deck.push(card);
        }
    }
    this.shuffleDeck(deck)
    return deck
};

Game.prototype.shuffleDeck = function (deck) {
    let i = 0
        , j = 0
        , temp = [];

    for (i = deck.length - 1; i > 0; i -= 1) {
        j = Math.floor(Math.random() * (i + 1));
        temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp
    }
};

Round.prototype.setDecree = function (deck) {
    let decree = deck.pop();
    return decree
};

// Round.prototype.start = function () {
//     // this.createDeck()
//     // this.shuffleDeck()
//     // this.receiveplayer.createHand(round.deck)
//     // this.dealplayer.createHand(round.deck)
//     // this.setDecree()
//     let state = new State(player1, player2, round, game)
//     return state
// }

app.use(express.static('public'))
app.use(cookieParser())

app.get('/', (req, res) => {
    console.log('Body', req.body)
    console.log('Cookie', req.cookies)
    if (!req.cookies.id) {
        let cookie = shortid.generate()
        res.setHeader('Set-Cookie', 'id=' + cookie)
    }
    if (!active[req.cookies.id]) {
        res.sendFile(__dirname + '/login.html')
    } else {
        res.sendFile(__dirname + '/main.html')
        console.log('here comes a user');
    }

});

app.get('/auth', (req, res) => {
    res.redirect(authorizationUri);
});

app.get('/nologin', (req, res) => {
    console.log(req.query)
    active[req.cookies.id] = {
        id: null,
        name: req.query.username,
        games: {}
    }
    console.log(active)
    res.redirect('/')
})

function Server () {
    this.active = {}
    this.users = {}
    this.games = {}
    this.pending = {}
}

Server.prototype.parseCookie = function(cookie) {
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

const server = new Server()
const active = server.active
const users = server.users
const games = server.games
const pending = server.pending

// Callback service parsing the authorization token and asking for the access token
app.get('/login',  (req, res) => {
    const code = req.query.code;
    let options = {
        code: code,
        redirect_uri: 'http://localhost:8000/login'
        // redirect_uri: 'http://fox-forest.alasdairwilkins.com/login'
    };

    return oauth2.authorizationCode.getToken(options)
        .then(function(token) {
            // console.log(token)
            let header = token.token_type + " " + token.access_token
            let options = {
                url: 'http://www.recurse.com/api/v1/profiles/me',
                headers: {'Authorization': header},
                json: true
            }
            return rp(options)
        })
        .then(function(response) {
            // console.log("And here we are!", response.id, response.first_name, response.last_name, response.email)

            // review findPlayer function
            let user = shortid.generate()

            active[req.cookies.id] = {id: user, name: response.first_name, games: {}}
            res.redirect('/')
        })
        .catch(function (err) {
            console.log(err)
            // alert('Authentication failed!')
            res.redirect('/')
        })
});

//review purpose of this function?

app.post('/codesent', function(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    console.log(req.body)
})

//review purpose of this function?

app.post('/woodcutterdraw', function(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    var card = round.deck.pop()
    res.send({'newcard': card})
})

//review purpose of this function?
//
// app.post('/computername', function(req, res) {
//     res.setHeader('Access-Control-Allow-Origin', '*')
//     fs.readFile('./names.json', 'utf8', function(err, data) {
//         let json = JSON.parse(data)
//         let names = json['names']
//         let num = Math.floor(Math.random() * 202)
//         let name = names[num]
//         res.send({'name': name})
//     })
// })

http.listen(8000, function() {
    console.log('Example app listening on port 8000!');
});

io.on('connection', function(socket){

    let cookie = server.parseCookie(socket.request.headers.cookie).id
    console.log('a user connected', socket.id, cookie);
    //check if player has display name

    if (active[cookie]) {
        let user = active[cookie]
        user.socket = socket.id
        console.log(user)
        socket.emit("startup", user)
    }

    //resume a game

    if (users[cookie]) {
        let gameroom = users[cookie][0]
        let game = games[gameroom]
        if (cookie === game.p1cookie && !game.p1socket) {
            game.p1socket = socket.id
            socket.join(gameroom)
            let startup = {'twoplayer': game.twoplayer, 'state': game.state}
            socket.emit("resumegame", startup)
        } else if (cookie === game['p2cookie'] && !game['p2socket']) {
            game.p2socket = socket.id
            socket.join(gameroom)
            let startup = {'twoplayer': game.twoplayer, 'state': game.state}
            socket.emit("resumegame", startup)
        } else {
            console.log("That's an error!")
        }
    }

    // check for email link -- will need to be fixed for login and Zulip

    // if (!socket.request.headers.referer === url) {
    //     console.log("A game code incoming!", console.log(socket.request.headers.referer))
    //     // let referer = socket.request.headers.referer
    //     // let query = referer.substr(url.length)
    //     // if (query.substr(0, 5) === '?code') {
    //     //     let code = query.substr(6)
    //     //     start2p(code, socket)
    //     // }
    // } else {
    //     console.log("Normal load up!", socket.request.headers.referer)
    // }



    socket.on('start1p', function(){
        let cookie = server.parseCookie(socket.request.headers.cookie).id
        let gameroom = shortid.generate()
        socket.join(gameroom)
        games[gameroom] = new Game(false, cookie, socket.id)
        active[cookie].games[gameroom] = games[gameroom]
        io.to(gameroom).emit('startupinfo', games[gameroom])
    })

    socket.on('start2p', function(msg){
        let cookie = server.parseCookie(socket.request.headers.cookie).id
        let gameroom = shortid.generate()
        pending[gameroom] = {p1: cookie}
        socket.join(gameroom)
        socket.emit('gamecode', gameroom)
    })

    socket.on('join2p', function(gameroom){
        if (pending[gameroom]) {
            let p1cookie = pending[gameroom].p1
            let p1socket = active[p1cookie].socket
            let p2cookie = server.parseCookie(socket.request.headers.cookie).id
            let p2socket = socket.id
            games[gameroom] = new Game(true, p1cookie, p1socket, p2cookie, p2socket)
            active[p1cookie].games[gameroom] = games[gameroom]
            active[p2cookie].games[gameroom] = games[gameroom]
            socket.join(gameroom)
            io.to(gameroom).emit('startupinfo', games[gameroom])
        } else {
            console.log("That game code doesn't exist!")
        }
    })


    socket.on('sendcode', function(msg){
        let link = `http://localhost:8000/?code=${msg.gameroom}`
        //let link = `http://fox-forest.alasdairwilkins.com/?code=${msg.gameroom}`
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
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        });
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
        socket.to(gameroom).emit('turninfo', msg)
    })

    socket.on('trickcompleted', function(msg) {
        state.decree = msg.decree
        state.trick = msg.trick
        trick.followplayer.hand = msg.hand
        state.turn = msg.turn
        trick.cards = msg.trick
        // if (state.turn === player1.id) {
        //     game.leadplayer = player2
        //     game.followplayer = player1
        // } else {
        //     game.leadplayer = player1
        //     game.followplayer = player2
        // }
        trick.score(state)
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
        if (users[cookie]) {
            for (let i = 0; i < users[cookie].length; i++) {
                let game = games[users[cookie][i]]
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