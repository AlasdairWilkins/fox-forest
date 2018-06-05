function Client() {
    this.cookie = this.parseCookie(document.cookie).id
    this.active = null
    this.games = {}
}

Client.prototype.start = function(gameinfo) {
    this.active = new Game(gameinfo)
    game = this.active
    round = game.round
    trick = round.trick
    player1 = gameinfo.player1.cookie === client.cookie ? game.displayplayer : game.remoteplayer
    player2 = gameinfo.player1.cookie === client.cookie ? game.remoteplayer : game.displayplayer
    console.log(game, round, trick, player1, player2)
    game.start()
}

Client.prototype.parseCookie = function(cookie) {
    cookie = cookie.split("; ").join(";")
    cookie = cookie.split(" =").join("=")
    cookie = cookie.split(";")

    let object = {}
    for (let i = 0; i < cookie.length; i++) {
        cookie[i] = cookie[i].split("=");
        object[cookie[i][0]] = decodeURIComponent(cookie[i][1])
    }
    return object
}

Client.prototype.clickedAI = function() {
    socket.emit('start1p')
}

Client.prototype.clicked2P = function() {
    document.getElementById("playerstartup").style.display = "none";
    document.getElementById("twoplayer").style.display = "block";
}

Client.prototype.clickedNew = function() {
    console.log('Got here!')
    socket.emit('start2p', "I'd like to start a game.")
}