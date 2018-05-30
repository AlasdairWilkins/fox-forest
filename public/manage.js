function State(player1, player2, trick, round, game) {
    this.player1 = player1
    this.player2 = player2
    this.id = game.id
    this.deal = round.dealplayer.id
    this.decree = round.decree
    this.deck = round.deck
    this.trick = trick.cards
}

function start(state, twoplayer) {
    prepare(state, twoplayer)
    display.buildGame()
    game.setEventListeners()
    game.start(state, twoplayer)
    display.build()
}
//
//     // round.start()
//     if (document.getElementById('leader-checkBox').checked) {
//             display.buildResults("trick-leader", "lead the", trick.leadplayer)
//         } else {
//             trick.start()
//         }
// }

function prepare(state, twoplayer) {
    player1 = new Player(state.player1.name, state.player1.id)
    player2 = new Player(state.player2.name, state.player2.id)
    if (twoplayer) {
        let cookie = "id=" + state.player1.id
        if (cookie === document.cookie) {
            game = new Game(true, state.id, player1, player2)
        } else {
            game = new Game(true, state.id, player2, player1)
        }
    } else {
        game = new Game(false, state.id, player1, player2)
    }
    round = new Round(player1, player2, game.twoplayer, state)
}
