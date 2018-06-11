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
    console.log(gameinfo)
    client.start(gameinfo)
})

socket.on('newround', function(roundinfo) {
    game.round = new Round(roundinfo, game)
    game.round.start()
})

socket.on('turninfo', function(state) {
    if (game.round.decree !== state['decree']) {
        game.round.decree = state['decree'];
        let carddata = {image: game.round.decree.image, mouseover: game.round.decree.mouseover}
        display.build('decree-card', cards, 'decree', carddata)
    }
    game.round.trick.cards = state['trick'];
    game.round.trick.play()
})

socket.on('trickresults', function(results) {
    display.clear('turn')
    game.round.receiveTrick(results)
})

// socket.on('announcement', function(msg) {
//     console.log(msg)
// })

socket.on('roundresults', function(results) {
    display.clear('turn')
    game.receiveRound(results)
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

socket.on('woodcuttercard', function(card) {
    game.displayplayer.insertWoodcutter(card)
})