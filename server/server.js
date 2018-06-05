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

module.exports = Server

//
// function start1p(gameroom, socket, name) {
//     games[gameroom]['p2socket'] = socket.id
//     newPlayer(gameroom, socket)
//     player1 = new Player('Alasdair', games[gameroom]['p1cookie'])
//     player2 = new Player(name, 'computer')
//     startGame(false, gameroom)
// }
//
// function startGame(choice, gameroom) {
//     game = new Game(choice, gameroom)
//     round = new Round(player1, player2)
//     state = round.start()
//     games[gameroom]['state'] = state
//     let startup = {'twoplayer': games[gameroom].twoplayer, 'state': state}
//     console.log(startup)
//     io.to(gameroom).emit('startupinfo', startup)
// }
//
// function start2p(gameroom, socket) {
//     games[gameroom]['p2socket'] = socket.id
//     newPlayer(gameroom, socket)
//     player1 = new Player('Alasdair', games[gameroom]['p1cookie'])
//     player2 = new Player('Kaley', games[gameroom]['p2cookie'])
//     startGame(true, gameroom)
// }

// function newPlayer(gameroom, socket, choice) {
//     let newcookie = parseCookie(socket.request.headers.cookie).id
//     if (!games[gameroom]) {
//         games[gameroom] = new Gameroom(choice, socket.id, newcookie)
//     } else {
//         if (games[gameroom].twoplayer) {
//             games[gameroom].p2socket = socket.id
//             games[gameroom].p2cookie = newcookie
//         } else {
//             games[gameroom].p2socket = 'computer'
//             games[gameroom].p2cookie = 'computer'
//         }
//     }
//     if (!users[newcookie]) {
//         users[newcookie] = [gameroom]
//     } else {
//         users[newcookie].push(gameroom)
//     }
//     socket.join(gameroom)
//
// }

// function nameAIPlayer(gameroom, socket) {
//     fs.readFile('./names.json', 'utf8', function(err, data) {
//         let json = JSON.parse(data)
//         let names = json['names']
//         let num = Math.floor(Math.random() * 202)
//         let name = names[num]
//         start1p(gameroom, socket, name)
//     })
// }

//
//
// function findPlayer(response) {
//     for (let user in users) {
//         if (users[user].recurse === response.id)
//             return user
//     }
//     let user = shortid.generate()
//     users[user] = {'recurse': response.id, 'first': response.first_name, 'last': response.last_name, 'email': response.email}
//     return {
//         id: user,
//         name: response.first_name
//     }
// }

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

// player1 = new Player("Alasdair", socket.id);
// let name = $.post("/computername", null, function (data, status) {
//     player2 = new Player(data.name);
//     game = new Game(true, player1, player2);
//     display.buildGame()
//     // document.getElementById("chat-dropdown").style.display = "block";
//     game.setEventListeners()
//     display.buildDisplayInfo();
//     round = new Round(player1, player2)
//     round.start();
//     if (document.getElementById('leader-checkBox').checked) {
//         display.buildResults("trick-leader", "lead the", trick.leadplayer)
//     } else {
//         trick.start()
//     }
// })

// Round.prototype.start = function () {
//     // this.createDeck()
//     // this.shuffleDeck()
//     // this.receiveplayer.createHand(round.deck)
//     // this.dealplayer.createHand(round.deck)
//     // this.setDecree()
//     let state = new State(player1, player2, round, game)
//     return state
// }