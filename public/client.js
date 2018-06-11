function Client() {
    this.cookie = this.parseCookie(document.cookie).id
    this.login = null
    this.active = null
    this.id = null
    this.name = null
    this.games = {}
}

Client.prototype.start = function(gameinfo) {
    this.active = new Game(gameinfo)
    game = this.active
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

Client.prototype.goHome = function() {
    //move from current
    if (this.active) {
        document.getElementById('play').style.display = 'none'
        document.getElementById('startup').style.display = 'block'
        // display.buildDisplayPlayer(this.name)
    }
    display.build('display-info', playerInfo, 'name', client.name)
    display.clear('remote-info')
    display.build('playerstartup', startup, 'home')
}

Client.prototype.clickedAI = function() {
    socket.emit('start1p')
}

Client.prototype.clickedNew = function() {
    socket.emit('start2p')
}