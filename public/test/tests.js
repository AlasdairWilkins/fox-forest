QUnit.test( "hello test", function( assert ) {
    assert.ok( 1 == "1", "Passed!" );
});

QUnit.test("trick score test", function ( assert ) {
    let client = new Client()
    client.clickedAI()
    //run some game
    assert.strictEqual(game.score, 5, "game score is equal to 5")
})

// function Server(local) {
//     this.local = local
//     if (this.local) {
//         this.socket = null;
//     } else {
//         this.socket = init socket;
//         socket.on('roundresults', (result) => this.roundResults(results))
//     }
//
//    // in normal mode, use socket
//    // in test mode, behave as a mock
// }
//
// Server.prototype.roundCompleted = function(gameId) {
//     if (this.test) {
//         this.roundResults({result object})
//     } else {
//         this.socket.emit('roundcompleted', gameId)
//     }
// }
//
// Server.prototype.roundResults = function(result) {
//     display.clear('turn')
//     game.scoreRound(result)
// }