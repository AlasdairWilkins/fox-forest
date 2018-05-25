// function State() {
//     this.stuff = null4
//
// }

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

function Game(choice, id, playera, playerb) {
    this.ai = choice; //game
    this.id = id
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
        if (player1 === game.dealplayer) {
            round = new Round(player2)
        } else {
            round = new Round(player1)
        }
        game.newRound();
    } else {
        //game.displayplayer.createHand(receivedhandinfo)
        //round.decree = receiveddecreeinfo
    }
    display.buildTrick();
    display.buildListActive();
};


Game.prototype.newRound = function (dealplayer) {
    round = new Round(dealplayer)
    round.createDeck()
    round.shuffleDeck()
    player1.createHand(round.deck)
    player2.createHand(round.deck)
    round.setDecree(round.deck)
    state = {'player1': player1.id, 'player2': player2.id, 'player1hand': player1.hand, 'player2hand': player2.hand, 'decree': round.decree, 'turn': game.turn}
    return state
}

Game.prototype.resetPlayers = function () {
    if (player1 === game.dealplayer) {
        game.leadplayer = player2;
        game.followplayer = player1
    } else {
        game.leadplayer = player1;
        game.followplayer = player2
    }
};

Game.prototype.doMonarch = function () {
    playablecards = this.hand.filter(card => {
        console.log(card)
        if (card.suit === game.trick[0].suit) {
            return true
        } else {
            return false
        }
    })

};

Game.prototype.start2p = function (datatemp) {
    console.log(datatemp)
    game.resetPlayers();
    round.decree = datatemp['decree'];
    if (game.displayplayer.id === player1.id) {
        game.displayplayer.hand = datatemp['player1hand'];
    } else {
        game.displayplayer.hand = datatemp['player2hand'];
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
    this.isMonarch = false;
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
        //$.post("http://localhost:8000/woodcutterdiscard", {'discard': discard}, game.displayplayer(oldcount))
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
            game.displayplayer.insertWoodcutter(card, suit, value)

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
    if (this.hand[cardtemp].mechanic !==null) {
        display.buildMechanic(this.hand[cardtemp].mechanic)
    }
    this.hand.splice(cardtemp, 1);
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
            socket.emit('roundcompleted', state)
        } else {
            socket.emit('turncompleted', state)
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
    let playablecard = Math.floor(Math.random() * (playablecards.length));
    let card = this.hand.indexOf(playablecards[playablecard])
    this.playCard(card);
    display.buildTrick()
}


Player.prototype.resetCards = function () {
    for (let i = 0; i < this.hand.length; i++) {
        this.hand[i].playable = true
    }
    if (this.isMonarch || this.isWoodcutter) {
        this.isMonarch = false;
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


app.use(express.static('public'))
app.use(cookieParser())

app.get('/', function(req, res){
    if (!req.cookies.id) {
        cookie = uniqid()
        res.setHeader('Set-Cookie', 'id='+cookie)
    } else {
        cookie = req.cookies.id

        //check if there is a game associated with this cookie

    }
    res.sendFile(__dirname + '/main.html')
    console.log('here comes a user', cookie);

    if (!connected) {
        io.on('connection', function(socket){

            //or possibly run the cookie to game check here

            connected = true
            console.log('a user connected', socket.id, cookie);

            if (req.query.code) {
                console.log("What was received:", req.query)
                startGame(req.query.code, socket)
                // if (games[req.query.code].length === 1) {
            }

            socket.on('2pgame', function(msg){
                console.log("And away we go!")
                gameroom = uniqid()
                let newcookie = parseCookie(socket.request.headers.cookie).id
                games[gameroom] = {'2p': true, 'p1socket': socket.id, 'p1cookie': newcookie}
                if (!players[newcookie]) {
                    players[newcookie] = [gameroom]
                    console.log(players)
                    console.log(players[newcookie])
                } else {
                    console.log(players)
                    console.log(players[newcookie])
                    players[newcookie].push(gameroom)
                }
                socket.join(gameroom)
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
                    html: `<b>${msg.gameroom}</b>, <a href='${link}'>${link}</a>`
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
                    startGame(msg, socket)
                }

            })

            socket.on('turncompleted', function(msg){

                //update gameroom's state information for reload here

                socket.to(gameroom).emit('turninfo', msg)
            })

            socket.on('trickcompleted', function(msg) {
                console.log(msg['hand'])
                round.decree = msg['decree']
                game.trick = msg['trick']
                game.turn = msg['turn']
                if (game.turn === player1.id) {
                    game.leadplayer = player2
                    game.followplayer = player1
                } else {
                    game.leadplayer = player1
                    game.iollowplayer = player2
                }
                game.scoreTrick(game.leadplayer, game.followplayer)
                game.turn = game.leadplayer.id
                game.roundcompleted = true
                state = ({
                    'decree': round.decree, 'trick': game.trick, 'turn': game.turn, 'result': game.trickwinner,
                    'player1': player1.id, 'player1tricks': player1.tricks, 'player1score': player1.score,
                    'player2': player2.id, 'player2tricks': player2.tricks, 'player2score': player2.score
                })

                //update gameroom's state information for reload here

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

            socket.on('roundstartup', function() {
                player1.hand = []
                player2.hand = []
                state = game.newRound(player2)
                io.in(gameroom).emit('newround', state)
            })

            socket.on('woodcutter', function(msg){
                var discard = msg['discard']
                round.deck.splice(0, 0, discard)
            })

            socket.on('disconnect', function(){

                //remove socket id from any active games

                console.log('a user disconnected');
                console.log(socket.id)
            });
        });
    }
});

function startGame(msg, socket) {
    games[msg]['p2socket'] =  socket.id
    let newcookie = parseCookie(socket.request.headers.cookie).id
    games[msg]['p2cookie'] = newcookie
    players[newcookie] = msg
    socket.join(gameroom)
    player1 = new Player('Alasdair', games[msg]['p1cookie'])
    player2 = new Player('Kaley', games[msg]['p2cookie'])
    game = new Game(player2.id, msg)
    state = game.newRound(player2)
    games[msg]['state'] = state
    console.log('As the game begins', games[msg])
    io.to(gameroom).emit('startupinfo', state)
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

let cookie = null
let player1 = null
let player2 = null
let game = null
let games = {}
let gameroom = null
let state = null
let scores = null
let jsonstate = null
let players = {}
let round = null
let trick = new Trick()
let connected = false
const suits = ['Bells', 'Keys', 'Moons']


