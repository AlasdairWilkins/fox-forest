function Game(choice, id, displayplayer, remoteplayer) {
    this.twoplayer = choice;
    this.id = id
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

Game.prototype.start = function (state) {
    player1.tricks = []
    player2.tricks = []
    round.decree = state.decree;
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

    trick = new Trick(round.receiveplayer, round.dealplayer)
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