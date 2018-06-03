function Client(info) {
    this.name = info.name
}

Client.prototype.clickedAI = function() {
    socket.emit('start1p', "I'd like to start a game.")
    // player1 = new Player("Alasdair", socket.id);
    // let name = $.post("/computername", null, function (data, status) {
    //     player2 = new Player(data.name);
    //     game = new Game(true, player1, player2);
    //     display.buildGame()
    //     // document.getElementById("chat-dropdown").style.display = "block";
    //     game.setEventListeners()
    //     display.buildDisplayInfo();
    //     round = new Round(player1, player2)
    //     round.start();
    //     if (document.getElementById('leader-checkBox').checked) {
    //         display.buildResults("trick-leader", "lead the", trick.leadplayer)
    //     } else {
    //         trick.start()
    //     }
    // })
}

Client.prototype.clicked2P = function() {
    document.getElementById("playerstartup").style.display = "none";
    document.getElementById("twoplayer").style.display = "block";
}

Client.prototype.clickedNew = function() {
    console.log('Got here!')
    socket.emit('start2p', "I'd like to start a game.")
}


let client = null
let player1 = null;
let player2 = null;
let game = null;
let state = null;
let round = null;
let trick = null;
let gameroom = null
const suits = ['Bells', 'Keys', 'Moons']
const stylesheet = document.documentElement.style
const display = new Display()