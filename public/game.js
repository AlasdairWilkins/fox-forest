function Game(game) {
    this.twoplayer = game.twoplayer;
    this.id = game.id
    this.deck = this.twoplayer ? null : game.deck
    this.displayplayer = game.player1.cookie === client.cookie ? new Player(game.player1) : new Player(game.player2)
    this.remoteplayer = game.player1.cookie === client.cookie ? new Player(game.player2) : new Player(game.player1)
    this.round = new Round(game.round, this)
    // this.gameOver = false; //game? or possibly round
    // this.winner = ''; //game
}

Game.prototype.resetPlayers = function () {
    if (player1 === game.dealplayer) {
        trick.leadplayer = player2;
        trick.followplayer = player1
    } else {
        trick.leadplayer = player1;
        trick.followplayer = player2
    }
};

Game.prototype.start = function (state) {
    display.buildGame()
    // game.setEventListeners()
    // display.build()
    if (trick.cards.length === 0) {
        if (document.getElementById('leader-checkBox').checked) {
            display.buildResults("trick-leader", "lead the", trick.leadplayer)
        } else {
            trick.start()
        }
    } else {
        trick.resume()
    }
}

Game.prototype.resume = function (state) {
    player1.tricks = state.player1.tricks
    player2.tricks = state.player2.tricks
    player1.score = state.player1.score
    player2.score = state.player2.score
    round.decree = state.decree
    if (game.twoplayer) {
        if (game.displayplayer.id === player1.id) {
            game.displayplayer.hand = state.player1.hand;
        } else {
            game.displayplayer.hand = state.player2.hand;
        }
    } else {
        player1.hand = state.player1.hand
        player2.hand = state.player2.hand
    }
    if (state.trick.length === 1) {
        trick = new Trick(game.remoteplayer, game.displayplayer)
        trick.cards = state.trick
    } else {
        trick = new Trick(game.displayplayer, game.remoteplayer)
    }
}