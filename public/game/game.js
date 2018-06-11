function Game(game) {
    this.twoplayer = game.twoplayer;
    this.id = game.id
    this.player1 = game.player1
    this.player2 = game.player2
    this.displayplayer = game.player1.cookie === client.cookie ? new Player(game.player1) : new Player(game.player2)
    this.remoteplayer = game.player1.cookie === client.cookie ? new Player(game.player2) : new Player(game.player1)
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
    let player1
    let player2
    if (this.displayplayer.cookie === results.p1cookie) {
        player1 = this.displayplayer
        player2 = this.remoteplayer
    } else {
        player1 = this.remoteplayer
        player2 = this.remoteplayer
    }
    player1.score = results.p1score
    player2.roundResult = results.p1result
    player1.score = results.p2score
    player2.roundResult = results.p2result
    if (document.getElementById('score-checkBox').checked) {
        display.buildResults("round-winner")
    } else {
        this.round.end()
    }
}