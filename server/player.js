//server-side file

function Player(deck, name, id, cookie, socket) {
    this.name = name ? name : names[Math.floor(Math.random() * names.length)];
    this.id = cookie ? id : 'computer';
    this.cookie = cookie ? cookie : null;
    this.socket = cookie ? socket : null;
    this.hand = this.createHand(deck)
    this.tricks = [];
    this.score = 0;
    this.treasure = 0;
}

Player.prototype.sortHand = function(hand) {
    hand.sort(function(a, b) {
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
    let hand = []
    for (let i = 0; i < 13; i++) {
        let newcard = deck.pop();
        hand.push(newcard)
    }
    this.sortHand(hand)
    return hand
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

const names = ["James", "John", "Robert", "Michael", "William", "David", "Richard", "Joseph", "Thomas", "Charles", "Christopher", "Daniel",
    "Matthew", "Anthony", "Donald", "Mark", "Paul", "Steven", "Andrew", "Kenneth", "George", "Joshua", "Kevin", "Brian", "Edward",
    "Ronald", "Timothy", "Jason", "Jeffrey", "Ryan", "Gary", "Jacob", "Nicholas", "Eric", "Stephen", "Jonathan", "Larry", "Justin",
    "Scott", "Frank", "Brandon", "Raymond", "Gregory", "Benjamin", "Samuel", "Patrick", "Alexander", "Jack", "Dennis", "Jerry", "Tyler",
    "Aaron", "Henry", "Douglas", "Jose", "Peter", "Adam", "Zachary", "Nathan", "Walter", "Harold", "Kyle", "Carl", "Arthur", "Gerald",
    "Roger", "Keith", "Jeremy", "Terry", "Lawrence", "Sean", "Christian", "Albert", "Joe", "Ethan", "Austin", "Jesse", "Willie", "Billy",
    "Bryan", "Bruce", "Jordan", "Ralph", "Roy", "Noah", "Dylan", "Eugene", "Wayne", "Alan", "Juan", "Louis", "Russell", "Gabriel",
    "Randy", "Philip", "Harry", "Vincent", "Bobby", "Johnny", "Logan", "Mary", "Patricia", "Jennifer", "Elizabeth", "Linda", "Barbara",
    "Susan", "Jessica", "Margaret", "Sarah", "Karen", "Nancy", "Betty", "Lisa", "Dorothy", "Sandra", "Ashley", "Kimberly", "Donna",
    "Carol", "Michelle", "Emily", "Amanda", "Helen", "Melissa", "Deborah", "Stephanie", "Laura", "Rebecca", "Sharon", "Cynthia",
    "Kathleen", "Amy", "Shirley", "Anna", "Angela", "Ruth", "Brenda", "Pamela", "Nicole", "Katherine", "Virginia", "Catherine",
    "Christine", "Samantha", "Debra", "Janet", "Rachel", "Carolyn", "Emma", "Maria", "Heather", "Diane", "Julie", "Joyce", "Evelyn",
    "Frances", "Joan", "Christina", "Kelly", "Victoria", "Lauren", "Martha", "Judith", "Cheryl", "Megan", "Andrea", "Ann", "Alice",
    "Jean", "Doris", "Jacqueline", "Kathryn", "Hannah", "Olivia", "Gloria", "Marie", "Teresa", "Sara", "Janice", "Julia", "Grace",
    "Judy", "Theresa", "Rose", "Beverly", "Denise", "Marilyn", "Amber", "Madison", "Danielle", "Brittany", "Diana", "Abigail", "Jane",
    "Natalie", "Lori", "Tiffany", "Alexis", "Kayla", "Rutherford", "Winifred"]

module.exports = Player