function Game(choice, displayplayer, remoteplayer) {
    this.twoplayer = choice;
    this.displayplayer = displayplayer
    this.remoteplayer = remoteplayer
    // this.results = {
    //     lead: "",
    //     follow: "",
    //     winner: ""
    // };
    this.gameOver = false; //game? or possibly round
    this.winner = ''; //game
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

Game.prototype.start2p = function (state) {
    player1.tricks = []
    player2.tricks = []
    round.decree = state.decree;
    if (game.displayplayer.id === player1.id) {
        game.displayplayer.hand = state.player1.hand;
    } else {
        game.displayplayer.hand = state.player2.hand;
    }
    trick = new Trick(round.receiveplayer, round.dealplayer)
}

Game.prototype.resume2p = function (state) {
    player1.tricks = state.player1.tricks
    player2.tricks = state.player2.tricks
    player1.score = state.player1.score
    player2.score = state.player2.score
    round.decree = state.decree
    if (game.displayplayer.id === player1.id) {
        game.displayplayer.hand = state.player1.hand
    } else {
        game.displayplayer.hand = state.player2.hand
    }
    if (state.trick.length === 1) {
        if (state.turn === game.displayplayer.id) {
            trick = new Trick(game.remoteplayer, game.displayplayer)
        } else {
            trick = new Trick(game.displayplayer, game.remoteplayer)
        }
        trick.cards = state.trick

    } else {
        if (state.turn === game.displayplayer.id) {
            trick = new Trick(game.displayplayer, game.remoteplayer)
        } else {
            trick = new Trick(game.remoteplayer, game.displayplayer)
        }
    }
}

Game.prototype.setEventListeners = function() {

    document.getElementById("trick-leader").addEventListener("animationend", function () {
        document.getElementById("trick-leader").style.display = "none";
        trick.start()
    })

    document.getElementById("trick-winner").addEventListener("animationend", function () {
        document.getElementById("trick-winner").style.display = "none";
        trick.end()
    })

    document.getElementById("round-winner").addEventListener("animationend", function () {
        document.getElementById("round-winner").style.display = "none"
        round.end()
    })

}