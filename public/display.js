function Display() {
    this.swan = `Swan: If you play this and lose the trick, you lead the next trick.`;
    this.fox = `Fox: When you play this, you may exchange the decree card with a card from your hand.`;
    this.woodcutter = `Woodcutter: When you play this, draw 1 card. Then discard any 1 card to the bottom of the deck.`;
    this.treasure = `Treasure: The winner of the trick receives 1 point for each 7 in the trick.`;
    this.witch = `Witch: When determining the winner of a trick with only one 9, treat the 9 as if it were in the trump suit.`;
    this.monarch = `Monarch: When you lead this, if your opponent has any cards of the same suit, they must play either the 1 or their highest card from that suit.`;
    this.mechanics = [null, this.swan, null, this.fox, null, this.woodcutter, null, this.treasure, null, this.witch, null, this.monarch]

    this.buildGameCode = function(code) {
        document.getElementById("newcode").innerHTML = `Your game code is ${code}.`
    }

    this.buildEmailSent = function(email) {
        document.getElementById("sentmessage").innerHTML = `The code has been sent to ${email}.`
    }

    this.resendEmail = function() {
        document.getElementById("emailsent").style.display = 'none'
        document.getElementById("createcode").style.display = 'block'
    }

    this.enterCode = function() {
        document.getElementById("twoplayer").style.display = 'none'
        document.getElementById("entercode").style.display = 'block'
    }

    this.buildDisplayInfo = function () {
        document.getElementById("display-name").innerHTML = game.displayplayer.name;
        document.getElementById("display-tricks").innerHTML = game.displayplayer.tricks.length;
        document.getElementById("display-score").innerHTML = game.displayplayer.score;
        document.getElementById("remote-name").innerHTML = game.remoteplayer.name;
        document.getElementById("remote-tricks").innerHTML = game.remoteplayer.tricks.length;
        document.getElementById("remote-score").innerHTML = game.remoteplayer.score
        // if (game.ai) {
        //     document.getElementById("display-name").innerHTML = `<button>${game.displayplayer.name}</button>`;
        //     document.getElementById("display-tricks").innerHTML = game.displayplayer.tricks.length;
        //     document.getElementById("display-score").innerHTML = game.displayplayer.score;
        //     document.getElementById("remote-name").innerHTML = game.remoteplayer.name;
        //     document.getElementById("remote-tricks").innerHTML = game.remoteplayer.tricks.length;
        //     document.getElementById("remote-score").innerHTML = game.remoteplayer.score
        // } else {
        //     document.getElementById("display-name").innerHTML = `<button>${game.displayplayer.name}</button>`;
        //     document.getElementById("display-tricks").innerHTML = game.displayplayer.tricks.length;
        //     document.getElementById("display-score").innerHTML = game.displayplayer.score;
        //     document.getElementById("remote-name").innerHTML =  `<button>${game.remoteplayer.name}</button>`;
        //     document.getElementById("remote-tricks").innerHTML = game.remoteplayer.tricks.length;
        //     document.getElementById("remote-score").innerHTML = game.remoteplayer.score
    }

    this.buildDecree = function (decreetemp) {
        document.getElementById("decree-card").innerHTML = `<img src=${round.decree.image} class="card" onmouseover="display.buildMechanic('${round.decree.value}')" onmouseout='display.clearMechanic()'>`;
    };

    this.buildScores = function () {
        document.getElementById("last-round").innerHTML = `As of the last round:`;
        document.getElementById("player-1-tricks").innerHTML = player1.roundResult;
        document.getElementById("player-2-tricks").innerHTML = player2.roundResult;
    };

    this.buildWinner = function () {
        document.getElementById("game-over").innerHTML = game.winner
    };

    this.buildMechanic = function (number) {
        if (this.mechanics[number] !== null) {
            document.getElementById("mechanic").innerHTML = `${this.mechanics[number]}`
        }
    };

    this.clearMechanic = function () {
        document.getElementById("mechanic").innerHTML = "Mouse over any odd-numbered card to see its special ability!"
    }

    this.buildResults = function (element, action, leadplayer) {
        let result = null
        if (element === "round-winner") {
            result = `${player1.roundResult}<br><br>${player2.roundResult}`
        } else {
            if (leadplayer.id === game.displayplayer.id) {
                result = `You ${action} trick!`
            } else {
                if (action === "lead the") {
                    result = `${game.remoteplayer.name} leads the trick!`
                } else {
                    result = `${game.remoteplayer.name} ${action} the trick!`
                }
            }
        }
        document.getElementById(element).innerHTML = `${result}`
        document.getElementById(element).style.display = "block";
    };

    this.buildTrick = function (zindex) {
        let newarray = trick.cards.map(function (card) {
            let count = trick.cards.indexOf(card) + 1;
            if (count === trick.cards.length) {
                let style = game.displayplayer.setTrickStyle(zindex)
                return `<img src=${card.image} class="card trick${count}" id="${card.id}" onmouseover="display.buildMechanic('${card.value}')" onmouseout='display.clearMechanic()' style=${style} >`
            } else {
                return `<img src=${card.image} class="card trick${count}" id="${card.id}" onmouseover="display.buildMechanic('${card.value}')" onmouseout='display.clearMechanic()'>`
            }

        }).join("");
        document.getElementById("trick-cards").innerHTML = newarray
    };

    this.buildWoodcutterList = function () {
        let handarray = game.displayplayer.hand.map(function (card) {
            let count = game.displayplayer.hand.indexOf(card);
            let style = game.displayplayer.setListStyle(count, count, card);
            return `<img src=${card.image} class="card" id="${card.id}" onclick='game.displayplayer.doWoodcutter(${count})' onmouseover="display.buildMechanic('${card.value}')" onmouseout='display.clearMechanic()' style=${style}>`
        }).join("");
        document.getElementById("hand").innerHTML = handarray
    };

    this.buildFoxList = function () {
        let handarray = game.displayplayer.hand.map(function (card) {
            let count = game.displayplayer.hand.indexOf(card)
            let style = game.displayplayer.setListStyle(count, count, card);
            return `<img src=${card.image} class="card" id="${card.id}" onclick='game.displayplayer.doFox(${count})' onmouseover="display.buildMechanic('${card.value}')" onmouseout='display.clearMechanic()' style=${style}>`
        }).join("");
        document.getElementById("hand").innerHTML = handarray
    };

    this.buildPassButton = function (passhtml) {
        document.getElementById("pass").innerHTML = passhtml
    };

    this.buildListDeal = function () {
        let handarray = game.displayplayer.hand.map(function (card) {
            let count = game.displayplayer.hand.indexOf(card)
            let style = game.displayplayer.setListStyle(count, count, card);
            return `<img src=${card.image} class="dealcard" id="${card.id}" style=${style} >`
        }).join("");
        document.getElementById("hand").innerHTML = handarray
    }

    this.buildListInactive = function (oldcount) {
        let z = 0
        let handarray = game.displayplayer.hand.map(function (card) {
            let count = game.displayplayer.hand.indexOf(card)
            if (z === oldcount) {
                z += 2
            } else {
                z += 1
            }
            let style = game.displayplayer.setListStyle(count, z, card);
            if (count < oldcount) {
                return `<img src=${card.image} class="card leftcard" id="${card.id}" onmouseover="display.buildMechanic('${card.value}')" onmouseout='display.clearMechanic()' style=${style} >`
            } else {
                return `<img src=${card.image} class="card rightcard" id="${card.id}" onmouseover="display.buildMechanic('${card.value}')" onmouseout='display.clearMechanic()' style=${style} >`
            }
        }).join("");
        document.getElementById("hand").innerHTML = handarray

    };

    this.buildListActive = function () {
        let tricksplayed = player1.tricks.length + player2.tricks.length;
        let handarray = game.displayplayer.hand.map(function (card) {
            let count = game.displayplayer.hand.indexOf(card);
            let style = game.displayplayer.setListStyle(count, count, card);
            if (card.playable) {
                if (card.value === 3 && tricksplayed < 12) {
                    return `<img src=${card.image} class="card" id="${card.id}" onclick='game.displayplayer.doFoxHuman(${count})' onmouseover="display.buildMechanic('${card.value}')" onmouseout='display.clearMechanic()' style=${style} >`
                } else if (card.value === 5 && tricksplayed < 12) {
                    return `<img src=${card.image} class="card" id="${card.id}" onclick='game.displayplayer.doWoodcutterHuman(${count})' onmouseover="display.buildMechanic('${card.value}')" onmouseout='display.clearMechanic()' style=${style} >`
                } else {
                    return `<img src=${card.image} class="card" id="${card.id}" onclick='game.displayplayer.clicked(${count})' onmouseover="display.buildMechanic('${card.value}')" onmouseout='display.clearMechanic()' style=${style} >`
                }
            } else {
                return `<img src=${card.image} class="card" id="${card.id}" style=${style} >`
            }
        }).join("")
        document.getElementById("hand").innerHTML = handarray
    };

    this.build2p = function() {
        display.buildDecree();
        display.buildListDeal();
        display.buildDisplayInfo();
        if (document.getElementById('leader-checkBox').checked) {
            display.buildResults("trick-leader", "lead the", trick.leadplayer)
        } else {
            trick.start()
        }
    }

    this.showDropdown = function(element) {
        document.getElementById(element).classList.toggle("show")
    }

    this.showModal = function(element) {
        document.getElementById(element).style.display = "block"
        if (element === 'video-tutorial-modal') {
            let tag = document.createElement('script');

            tag.src = "https://www.youtube.com/iframe_api";
            let firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        }
    }

    this.clearModal = function(element) {
        document.getElementById(element).style.display = "none"
    }

    this.buildHint = function(value) {
        if (value === 3) {
            document.getElementById('hint').innerHTML = 'Hint: You can now change the decree card with a card from your deck, or keep the current one.'
        } else if (value === 5) {
            document.getElementById('hint').innerHTML = "Hint: You have drawn an extra card from the deck, so now discard one you don't want to keep."
        }
    }

    this.clearHint = function(value) {
        document.getElementById('hint').innerHTML = ''
    }

    this.buildDisplayTurn = function() {
        document.getElementById('turn').innerHTML = "It's your turn!"
    }

    this.buildRemoteTurn = function() {
        document.getElementById('turn').innerHTML = `Waiting for ${game.remoteplayer.name} to play a card!`
    }

    this.clearTurn = function() {
        document.getElementById('turn').innerHTML = ''
    }
}