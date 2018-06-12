const Player = require('./player')

function Results (game, round, trick) {
    this.player1 = game.player1
    this.player2 = game.player2
    if (trick) {
        this.decree = round.decree
        this.trick = trick
    } else {
        this.p1score = game.player1.getScores()
        this.p2score = game.player2.getScores()
    }
}

module.exports = Results