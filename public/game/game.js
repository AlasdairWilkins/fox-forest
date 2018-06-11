function Game(game) {
    this.twoplayer = game.twoplayer;
    this.id = game.id
    this.player1 = new Player(game.player1)
    this.player2 = new Player(game.player2)
    this.displayplayer = game.player1.cookie === client.cookie ? this.player1 : this.player2
    this.remoteplayer = game.player1.cookie === client.cookie ? this.player2 : this.player1
    this.round = new Round(game.round, this)
}

Game.prototype.start = function (state) {
    let displayInfo = new PlayerInfo(this.displayplayer)
    let remoteInfo = new PlayerInfo(this.remoteplayer)
    display.build('display-info', playerInfo, 'game', displayInfo)
    display.build('remote-info', playerInfo, 'game', remoteInfo)
    display.buildGame()
    this.round.start()
}

Game.prototype.resume = function (state) {
    this.player1.tricks = state.player1.tricks
    this.player2.tricks = state.player2.tricks
    this.player1.score = state.player1.score
    this.player2.score = state.player2.score
    this.round.decree = state.decree
    if (this.twoplayer) {
        this.displayplayer.cookie === player1.cookie ? this.displayplayer.hand = state.player1.hand : this.displayplayer.hand = state.player2.hand;
    } else {
        this.player1.hand = state.player1.hand
        this.player2.hand = state.player2.hand
    }
    if (state.trick.length === 1) {
        this.round.trick = new Trick(this.remoteplayer, this.displayplayer)
        this.round.trick.cards = state.trick
    } else {
        this.round.trick = new Trick(this.displayplayer, this.remoteplayer)
    }
}

Game.prototype.update = function() {
    let state = new State(this.displayplayer, this, this.round, this.round.trick)
    console.log("State:", state)
    socket.emit('updatestate', state)
}

Game.prototype.receiveRound = function (results) {
    this.player1.score = results.p1score
    this.player1.roundResult = results.p1result
    this.player2.score = results.p2score
    this.player2.roundResult = results.p2result
    if (document.getElementById('score-checkBox').checked) {
        display.buildResults("round-winner")
    } else {
        this.round.end()
    }
}

Game.prototype.resetRound = function() {
    this.round = new Round(this.round)
    this.round.start()
}