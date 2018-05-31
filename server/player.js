//server-side file

console.log("Yo wassup")

function Player(name, id) {
    this.name = name;
    this.id = id;
    this.hand = [];
    this.tricks = [];
    this.score = 0;
    this.treasure = 0;
    this.wonLast = false
    this.roundResult = null;
}

Player.prototype.sortHand = function() {
    this.hand.sort(function(a, b) {
        if (a.suit === b.suit) {
            return a.value - b.value
        } else {
            if (a.suit > b.suit) {
                return 1
            } else {
                return -1
            }
        }
    })
}

Player.prototype.createHand = function (deck) {
    for (let i = 0; i < 13; i++) {
        let newcard = deck.pop();
        this.hand.push(newcard)
    }
    this.sortHand()
};

Player.prototype.getScores = function () {
    let tricks = this.tricks.length;
    let score = 0;
    if (tricks <= 3) {
        score = 6
    } else if (tricks === 4) {
        score = 1
    } else if (tricks === 5) {
        score = 2
    } else if (tricks === 6) {
        score += 3
    } else if (7 <= tricks && tricks <= 9) {
        score += 6
    }
    if (this.treasure === 0) {
        if (tricks === 1) {
            this.roundResult = `${this.name} won  1 trick and scored 6 points.`
        } else if (score === 1) {
            this.roundResult = `${this.name} won 4 tricks and scored 1 point.`
        } else {
            this.roundResult = `${this.name} won ${this.tricks.length} tricks and scored ${score} points.`
        }
    } else if (this.treasure === 1) {
        if (tricks === 1) {
            this.roundResult = `${this.name} won  1 trick, collected 1 treasure, and scored 7 points.`
        } else if (tricks >= 10) {
            this.roundResult = `${this.name} won  ${this.tricks.length} tricks, collected 1 treasure, and scored 1 point.`
        }
        else {
            let treasurescore = score + 1;
            this.roundResult = `${this.name} won ${this.tricks.length} tricks, collected 1 treasure, and scored ${treasurescore} points.`
        }
    } else {
        let treasurescore = score + this.treasure;
        if (tricks === 1) {
            this.roundResult = `${this.name} won 1 trick, collected ${this.treasure} treasures, and scored ${treasurescore} points.`
        } else {
            this.roundResult = `${this.name} won ${this.tricks.length} tricks, collected ${this.treasure} treasures, and scored ${treasurescore} points.`
        }
    }
    this.score += score;
    this.treasure = 0;
    this.tricks = []
};

module.exports = Player