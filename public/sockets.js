socket.on('login', function() {
    display.build('main', main, 'login')
})

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

socket.on('newround', function(roundinfo) {
    game.resetRound(roundinfo)
})

socket.on('turninfo', function(state) {
    if (game.round.decree !== state['decree']) {
        game.round.decree = state['decree'];
        display.build('decree-card', cards, 'decree', game.round.decree)
    }
    game.round.trick.cards = state['trick'];
    game.round.trick.play()
})

socket.on('trickresults', function(result) {
    display.clear('turn')
    game.round.receiveTrick(result)
})

socket.on('roundresults', function(result) {
    display.clear('turn')
    game.scoreRound(result)
})

socket.on('zulipinfo', function(msg) {
    display.build('playerstartup', startup, 'zulipcode', gamecode)
    addresses = msg.addresses
    demo1 = new autoComplete({
        selector: '#zulipentry',
        minChars: 1,
        source: function (term, suggest) {
            term = term.toLowerCase();
            var choices = msg.names
            var suggestions = [];
            for (i = 0; i < choices.length; i++)
                if (~choices[i].toLowerCase().indexOf(term)) suggestions.push(choices[i]);
            suggest(suggestions);
        }
    })
})

socket.on('woodcuttercard', function(donext, card) {
    game.displayplayer.insertWoodcutter(card)
})

//

