function Game(choice, displayplayer, remoteplayer) {
    this.ai = choice;
    this.displayplayer = displayplayer
    this.remoteplayer = remoteplayer
    this.results = {
        lead: "",
        follow: "",
        winner: ""
    };
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

Game.prototype.start2p = function (msg) {
    player1.tricks = []
    player2.tricks = []
    round.decree = msg['decree'];
    if (game.displayplayer.id === player1.id) {
        game.displayplayer.hand = msg['player1hand'];
    } else {
        game.displayplayer.hand = msg['player2hand'];
    }
    trick = new Trick(round.receiveplayer, round.dealplayer)
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