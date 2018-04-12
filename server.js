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
    this.sendplayer = player1;
    this.receiverplayer = player2;
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

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// this stores game state in a local variable, which will disappear each time you restart
var gameState;

app.get('/getgamestate', function(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.send(gameState);
});

app.post('/sendgamestate', function(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    console.log(req.body)
    gameState = req.body
    res.send('Ahoy Hoy!')
})

app.listen(8000, function() {
    console.log('Example app listening on port 8000!');
});