require('dotenv').config()

const Server = require("./server")
const Game = require("./game")
const Round = require("./round")
const Trick = require("./trick")
const Player = require("./player")
const Card = require("./card")

server = new Server()
active = server.active
users = server.users
games = server.games
pending = server.pending

const url = process.env.SITE_URL
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

const zulip = require('zulip-js')

const zulipConfig = {
    username: 'fox-forest-bot@recurse.zulipchat.com',
    apiKey: process.env.ZULIP_KEY,
    realm: 'https://recurse.zulipchat.com'
};

//https://www.recurse.com/settings/apps

const credentials = {
    client: {
        id: process.env.RC_ID,
        secret: process.env.RC_SECRET
    },
    auth: {
        tokenHost: 'https://www.recurse.com'
    }
};
const oauth2 = require('simple-oauth2').create(credentials);
const authorizationUri = oauth2.authorizationCode.authorizeURL({
    redirect_uri: url + '/login'
    // redirect_uri: 'http://fox-forest.alasdairwilkins.com/login',
});

function Results (game, round, trick) {
    if (trick) {
        this.player1 = game.player1
        this.player2 = game.player2
        this.decree = round.decree
        this.trick = trick
    }
}

http.listen(8000, function() {
    console.log('Example app listening on port 8000!');
});

app.use(express.static('public'))
app.use(cookieParser())

app.get('/', (req, res) => {
    // console.log('Body', req.body)
    console.log('Cookie', req.cookies)
    console.log("/", req.headers.referer)
    let cookie
    if (!req.cookies.id) {
        cookie = shortid.generate()
        res.setHeader('Set-Cookie', 'id=' + cookie)
    } else {
        cookie = req.cookies.id
    }
    if (req.query.code) {
        let code = req.query.code
        res.setHeader('Set-Cookie', 'code=' + code)
    }
    if (!active[req.cookies.id]) {
        res.sendFile(__dirname + '/login.html')
    } else {
        res.sendFile(__dirname + '/main.html')
        console.log('here comes a user');
    }
});

app.get('/auth', (req, res) => {
    console.log("/auth", req.headers.referer)
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

// Callback service parsing the authorization token and asking for the access token
app.get('/login',  (req, res) => {
    console.log("/login", req.headers.referer)
    const code = req.query.code;
    let options = {
        code: code,
        redirect_uri: url + '/login'
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

            active[req.cookies.id] = {id: user, name: response.first_name, login: 'recurse', games: {}}
            res.redirect('/')
        })
        .catch(function (err) {
            console.log(err)
            // alert('Authentication failed!')
            res.redirect('/')
        })
});

//review purpose of this function?

// app.post('/codesent', function(req, res) {
//     res.setHeader('Access-Control-Allow-Origin', '*')
//     console.log(req.body)
// })

//review purpose of this function?

// app.post('/woodcutterdraw', function(req, res) {
//     res.setHeader('Access-Control-Allow-Origin', '*')
//     var card = round.deck.pop()
//     res.send({'newcard': card})
// })

io.on('connection', function(socket){

    let cookie = server.parseCookie(socket.request.headers.cookie).id
    console.log('a user connected', socket.id, cookie);
    //check if player has display name

    if (active[cookie]) {
        let user = active[cookie]
        user.socket = socket.id
        socket.emit('startup', user)

        if (user.current) {
            console.log(user.current)
            let gameroom = user.current
            let game = games[gameroom]
            if (cookie === game.player1.cookie && !game.player1.socket) {
                game.player1.socket = socket.id
                socket.join(gameroom)
                socket.emit("startupinfo", game)
            } else if (cookie === game.player2.cookie && !game.player2.socket) {
                game.player2.socket = socket.id
                socket.join(gameroom)
                socket.emit("startupinfo", game)
            } else {
                console.log("That's an error!")
            }
        }

        if (server.parseCookie(socket.request.headers.cookie).code) {
            console.log("Hello!")
            let gameroom = server.parseCookie(socket.request.headers.cookie).code
            if (pending[gameroom]) {
                console.log("Ahoy hoy!")
                server.createGame(socket, gameroom)
                socket.join(gameroom)
                io.to(gameroom).emit('startupinfo', games[gameroom])
            }
        }

    }

    // check for email link -- will need to be fixed for login and Zulip

    // if (!socket.request.headers.referer === url) {
    //     console.log("A game code incoming!", console.log(socket.request.headers.referer))
    // //     // let referer = socket.request.headers.referer
    // //     // let query = referer.substr(url.length)
    // //     // if (query.substr(0, 5) === '?code') {
    // //     //     let code = query.substr(6)
    // //     //     start2p(code, socket)
    // //     // }
    // } else {
    //     console.log("Normal load up!", socket.request.headers.referer)
    // }

    socket.on('start1p', function(){
        let cookie = server.parseCookie(socket.request.headers.cookie).id
        let gameroom = shortid.generate()
        socket.join(gameroom)
        games[gameroom] = new Game(false, gameroom, cookie, socket.id)
        active[cookie].games[gameroom] = games[gameroom]
        active[cookie].current = gameroom
        io.to(gameroom).emit('startupinfo', games[gameroom])
    })

    socket.on('start2p', function(){
        let cookie = server.parseCookie(socket.request.headers.cookie).id
        let gameroom = shortid.generate()
        pending[gameroom] = {p1: cookie}
        socket.join(gameroom)
        socket.emit('gamecode', gameroom)
    })

    socket.on('join2p', function(gameroom){
        if (pending[gameroom]) {
            server.createGame(socket, gameroom)
            socket.join(gameroom)
            io.to(gameroom).emit('startupinfo', games[gameroom])
        } else {
            console.log("That game code doesn't exist!")
        }
    })

    socket.on('zulipget', function() {
        zulip(zulipConfig)
            .then(function(client) {
                return client.users.retrieve()
            })
            .then(function(results) {
                let users = results.members
                let names = []
                let addresses = {}
                for (let user = 0; user < users.length; user++) {
                    if (!users[user]['is_bot']) {
                        addresses[users[user].full_name] = users[user].email
                    }
                }
                names = Object.keys(addresses)
                names.sort()
                socket.emit('zulipinfo', {names: names, addresses: addresses})
            })
            .catch(function (err) {
                console.log("Error:", err)
            })
    })

    socket.on('zulipsend', function(msg) {
        let address = msg.address
        let code = msg.code
        let name = msg.name
        zulip(zulipConfig)
            .then(function(client) {
                const params = {
                    to: address,
                    type: 'private',
                    content: `${name} has invited you to play a game of The Fox in the Forest. [Click here](${url}?code=${code}) to play. Good luck!`
                    // content: "You've been invited to play a game of The Fox in the Forest!"
                }
                return client.messages.send(params)
            })
            .then(function(result) {
                console.log(result)
            })
    })

    socket.on('sendcode', function(msg){
        let link = `${url}/?code=${msg.gameroom}`
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'alasdairprograms@gmail.com',
                pass: process.env.MAIL_PASS
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

    socket.on('updatestate', function (state) {
        console.log(state)
        debugger
        let game = games[state.id]
        game.update(state)
    })

    socket.on('turncompleted', function(state){
        let gameroom = state.id
        let game = games[gameroom]
        game.update(state)
        if (state.turn === game.player1.id) {
            state.turn = game.player2.id
            game.turn = game.player2.id
        } else {
            state.turn = game.player1.id
            game.turn = game.player1.id
        }
        socket.to(gameroom).emit('turninfo', state)
    })

    socket.on('trickcompleted', function(state) {
        let gameroom = state.id
        let game = games[gameroom]
        let round = game.round
        let trick = round.trick
        game.update(state)
        trick.score(state)
        let results = new Results(game, round, trick)
        console.log(results)
        io.in(gameroom).emit('trickresults', results)
        console.log("And now!", trick.hasSwan, !trick.hasSwan)
        trick.hasSwan ? game.round.trick = new Trick(trick.loser, trick.winner) : game.round.trick = new Trick(trick.winner, trick.loser)
        console.log("First:", trick)
        console.log("Second:", game.round.trick)
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
        if (active[cookie]) {
            if (active[cookie].current) {
                let game = games[active[cookie].current]
                if (game.player1.cookie === cookie) {
                    game.player1.socket = null
                }
                if (game.player2.cookie === cookie) {
                    game.player2.socket = null
                }
            }
        }
        console.log('a user disconnected');
        console.log(socket.id, cookie)
    });
});