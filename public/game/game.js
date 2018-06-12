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
    // let displayInfo = new PlayerInfo(this.displayplayer)
    // let remoteInfo = new PlayerInfo(this.remoteplayer)
    display.build('display-info', playerInfo, 'game', this.displayplayer)
    display.build('remote-info', playerInfo, 'game', this.remoteplayer)
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
    socket.emit('updatestate', state)
}

Game.prototype.scoreRound = function (result) {
    if (this.twoplayer) {
        this.player1.score = result.p1score
        this.player2.score = result.p2score
    } else {
        this.player1.score = this.player1.getScores()
        this.player2.score = this.player2.getScores()
    }
    if (document.getElementById('score-checkBox').checked) {
        display.build('trick-info', results, 'round', game)
    } else {
        this.round.end()
    }
}

Game.prototype.resetRound = function(roundinfo) {
    if (this.twoplayer) {
        this.round = new Round(roundinfo, game)
    } else {
        this.round = new Round(this.round)
    }
    this.player1.tricks = []
    this.player2.tricks = []
    this.player1.treasure = 0
    this.player2.treasure = 0
    display.build('display-info', playerInfo, 'game', this.displayplayer)
    display.build('remote-info', playerInfo, 'game', this.remoteplayer)
    this.round.start()
}