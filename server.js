// // Load HTTP module
// var http = require("http");
//
// // Create HTTP server and listen on port 8000 for requests
// http.createServer(function(request, response) {
//
//     // Set the response HTTP header with HTTP status and Content type
//     response.writeHead(200, {'Content-Type': 'text/plain','Access-Control-Allow-Origin':'*'});
//
//     // Send the response body "Hello World"
//     response.end('{"hand": [3,4,5]}');
// }).listen(8000);

//body-parser

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