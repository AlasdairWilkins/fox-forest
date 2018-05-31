//server-side file

function Trick(leadplayer, followplayer) {
    this.cards = []
    this.leadplayer = leadplayer
    this.followplayer = followplayer
    this.winner = null;
    this.witchReset = false;
    this.hasSwan = false;
    this.loser = null
}

Trick.prototype.doWitch = function (state) {
    let oldsuittemp = "";
    let position = 0;
    if (this.cards[0].value === 9) {
        oldsuittemp = this.cards[0].suit;
        this.cards[0].suit = state.decree.suit
    } else {
        oldsuittemp = this.cards[1].suit;
        position = 1;
        this.cards[1].suit = state.decree.suit
    }
    this.witchReset = true;
    return {
        suit: oldsuittemp,
        position: position
    }
};

Trick.prototype.hasSevens = function() {
    let sevens = 0
    for (let i = 0; i < 2; i++) {
        if (this.cards[i].value === 7) {
            sevens += 1
        }
    }
    return sevens
};

Trick.prototype.score = function (state) {
    let olddata = this.cards[0].value === 9 ^ this.cards[1].value === 9 ? this.doWitch(state) : null
    if (this.cards[0].suit === this.cards[1].suit) {
        if (this.cards[0].value > this.cards[1].value) {
            if (this.witchReset) {
                this.cards[olddata.position].suit = olddata.suit;
            }
            if (this.cards[1].value === 1) {
                this.hasSwan = true
            }
            this.winner = this.leadplayer
            this.loser = this.followplayer
        } else {
            if (this.witchReset) {
                this.cards[olddata.position].suit = olddata.suit;
            }
            if (this.cards[0].value === 1) {
                this.hasSwan = true
            }
            this.winner = this.followplayer
            this.loser = this.leadplayer
        }
    } else {
        if (this.cards[1].suit === state.decree.suit) {
            if (this.witchReset) {
                this.cards[olddata.position].suit = olddata.suit;
            }
            if (this.cards[0].value === 1) {
                this.hasSwan = true
            }
            this.winner = this.followplayer
            this.loser = this.leadplayer
        } else {
            if (this.witchReset) {
                this.cards[olddata.position].suit = olddata.suit;
            }
            if (this.cards[1].value === 1) {
                this.hasSwan = true
            }
            this.winner = this.leadplayer
            this.loser = this.followplayer
        }
    }
    this.winner.score += this.hasSevens()
    this.winner.treasure += this.hasSevens()
    this.winner.tricks.push(this.cards);
};

module.exports = Trick