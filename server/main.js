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

let player1 = null
let player2 = null
let round = null
let trick = null
let gameroom = null
let state = null
let scores = null

http.listen(8000, function() {
    console.log('Example app listening on port 8000!');
});

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

io.on('connection', function(socket){

    let cookie = server.parseCookie(socket.request.headers.cookie).id
    console.log('a user connected', socket.id, cookie);
    //check if player has display name

    if (active[cookie]) {
        let user = active[cookie]
        user.socket = socket.id
        socket.emit('startup', user)

        if (user.current) {
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
        games[gameroom] = new Game(false, gameroom, cookie, socket.id)
        active[cookie].games[gameroom] = games[gameroom]
        active[cookie].current = gameroom
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
            games[gameroom] = new Game(true, gameroom, p1cookie, p1socket, p2cookie, p2socket)
            active[p1cookie].games[gameroom] = games[gameroom]
            active[p2cookie].games[gameroom] = games[gameroom]
            socket.join(gameroom)
            console.log("The gameroom is", gameroom)
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

    socket.on('updatestate', function (state) {
        let game = games[state.id]
        console.log("The game to update", game)
        game.update(state)
    })

    socket.on('turncompleted', function(state){
        let gameroom = state.id
        let game = games[gameroom]
        game.update(state)
        if (state.turn === state.player1.id) {
            state.turn = state.player2.id
            game.turn = state.player2.id
        } else {
            state.turn = state.player1.id
            game.turn = state.player1.id
        }
        console.log("And here we go!", gameroom)
        socket.to(gameroom).emit('turninfo', state)
    })

    socket.on('trickcompleted', function(state) {
        let gameroom = state.id
        let game = games[gameroom]
        let trick = game.round.trick
        game.update(state)
        trick.score(state)
        !trick.hasSwan ? trick = new Trick(trick.winner, trick.loser) : trick = new Trick(trick.loser, trick.winner)
        state.trick = trick
        io.in(gameroom).emit('trickresults', state)
    })

    //FIX THIS!!!!! ------>>>>>

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
                console.log("Cookie:", cookie, "P1 Cookie:", game.player1.cookie, "P2 Cookie:", game.player2.cookie)
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