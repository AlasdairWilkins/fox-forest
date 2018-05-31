
socket.on('gamecode', function(msg) {
    gameroom = msg
    display.buildGameCode(msg)
    document.getElementById("twoplayer").style.display = "none";
    document.getElementById("createcode").style.display = "block";
    document.getElementById("email").style.display = "block"
})
//
// socket.on('startup')
//
// socket.on('gamebeginning')

socket.on('playername', function(msg) {
    display.buildDisplayPlayer(msg)
})

socket.on('startupinfo', function(msg) {
        start(msg.state, msg.twoplayer)
})

socket.on('resumegame', function(msg) {
    console.log(msg)
    prepare(msg.state, msg.twoplayer)
    display.buildGame()
    game.setEventListeners()
    game.resume(msg.state)
    display.build()
})

socket.on('newround', function(msg) {
    if (round.dealplayer.id === player1.id) {
        round = new Round(player2, player1)
        trick.leadplayer = player1
    } else {
        round = new Round(player1, player2)
        trick.leadplayer = player2
    }
    game.start2p(msg)
    display.build2p()
})

socket.on('turninfo', function(msg) {
    console.log(msg)
    if (round.decree != msg['decree']) {
        round.decree = msg['decree'];
        display.buildDecree();
    }
    trick.cards = msg['trick'];
    trick.play()
})

socket.on('trickresults', function(msg) {
    console.log(msg)
    game.displayplayer.receiveScores(msg, 0)
})

socket.on('announcement', function(msg) {
    console.log(msg)
})

socket.on('roundresults', function(msg) {
    display.clearTurn()
    player1.score = msg['p1score']
    player1.roundResult = msg['p1result']
    player2.score = msg['p2score']
    player2.roundResult = msg['p2result']
    if (document.getElementById('score-checkBox').checked) {
        display.buildResults("round-winner")
    } else {
        round.end()
    }
})


$('#email').on('submit', function(submit) {
    submit.preventDefault()
    let email = document.getElementById('emailentry').value
    socket.emit('sendcode', {'gameroom': gameroom, 'email': email})
    display.buildEmailSent(email)
    document.getElementById('createcode').style.display = 'none'
    document.getElementById('emailsent').style.display = 'block'

})

$('#entercode').on('submit', function(submit) {
    submit.preventDefault()
    let code = document.getElementById('codeentry').value
    socket.emit('startgame', code)
})