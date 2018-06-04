function State(player1, player2, trick, round, game) {
    this.player1 = player1
    this.player2 = player2
    this.id = game.id
    this.deal = round.deal
    this.decree = round.decree
    this.deck = round.deck
    this.trick = trick.cards
    this.turn = game.turn
}
