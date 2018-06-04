
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



function findPlayer(response) {
    for (let user in users) {
        if (users[user].recurse === response.id)
            return user
    }
    let user = shortid.generate()
    users[user] = {'recurse': response.id, 'first': response.first_name, 'last': response.last_name, 'email': response.email}
    return {
        id: user,
        name: response.first_name
    }
}