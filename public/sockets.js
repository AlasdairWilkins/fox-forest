socket.on('startup', function(userinfo) {
    client.name = userinfo.name
    client.id = userinfo.id
    client.login = userinfo.login
    display.build('display-info', playerInfo, 'name', client.name)
})


socket.on('gamecode', function(code) {
    gamecode = code
    if (client.login === 'recurse') {
        display.build('playerstartup', startup, 'codeoptions', code)
    } else {
        display.build('playerstartup', startup, 'emailcode', code)
    }
})

socket.on('startupinfo', function(gameinfo) {
    client.start(gameinfo)
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

socket.on('turninfo', function(state) {
    if (round.decree != state['decree']) {
        round.decree = state['decree'];
        display.buildDecree();
    }
    trick.cards = state['trick'];
    trick.play()
})

socket.on('trickresults', function(results) {
    console.log(results)
    game.displayplayer.receiveScores(results)
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

socket.on('zulipinfo', function(msg) {
    console.log(msg)
    display.build('playerstartup', startup, 'zulipcode', gamecode)
})