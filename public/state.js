function State(player, game, round, trick) {
    this.player = player
    this.id = game.id
    this.deal = round.deal
    this.decree = round.decree
    this.deck = round.deck
    this.trick = trick.cards
    this.turn = game.turn
}
