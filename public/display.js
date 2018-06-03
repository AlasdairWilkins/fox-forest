const forms = {username:
        {id: 'loginselect',
            formId: 'username',
            action: "action='/nologin' method='get'",
            // inputId: 'usernameentry',
            text: 'Enter your display name.',
            default: 'Your name'
            }}


function Display() {
    this.swan = `Swan: If you play this and lose the trick, you lead the next trick.`;
    this.fox = `Fox: When you play this, you may exchange the decree card with a card from your hand.`;
    this.woodcutter = `Woodcutter: When you play this, draw 1 card. Then discard any 1 card to the bottom of the deck.`;
    this.treasure = `Treasure: The winner of the trick receives 1 point for each 7 in the trick.`;
    this.witch = `Witch: When determining the winner of a trick with only one 9, treat the 9 as if it were in the trump suit.`;
    this.monarch = `Monarch: When you lead this, if your opponent has any cards of the same suit, they must play either the 1 or their highest card from that suit.`;
    this.mechanics = [null, this.swan, null, this.fox, null, this.woodcutter, null, this.treasure, null, this.witch, null, this.monarch]

    this.buildForm = function(value) {
        let form = forms[value]
        document.getElementById(form.id).innerHTML =
            `<form id="${form.formId}" ${form.action}>
                ${form.text}<br>
                <input name="${form.formId}" type="text" onfocus="this.value=''" value='${form.default}'><br><br>
                <input type="submit" value="Submit">
            </form>`
        if (!form.action) {
            console.log('Hello!')
        }
    }



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

    this.buildDisplayPlayer = function(name) {
        document.getElementById("players-info").classList.remove("setup");
        document.getElementById("players-info").classList.add("player");
        document.getElementById("display-container").style.display = "contents";
        document.getElementById("display-info").style.display = "none"
        document.getElementById("player-name").innerHTML = `<span>${name}</span>`;
    }

    this.buildDisplayInfo = function () {
        document.getElementById("players-info").classList.remove("player");
        document.getElementById("players-info").classList.add("game");
        document.getElementById("player-name").style.display = "none"
        document.getElementById("display-info").style.display = "block"
        document.getElementById("display-name").innerHTML = game.displayplayer.name;
        document.getElementById("display-tricks").innerHTML = game.displayplayer.tricks.length;
        document.getElementById("display-score").innerHTML = game.displayplayer.score;
        document.getElementById("remote-name").innerHTML = game.remoteplayer.name;
        document.getElementById("remote-tricks").innerHTML = game.remoteplayer.tricks.length;
        document.getElementById("remote-score").innerHTML = game.remoteplayer.score
        // if (!game.twoplayer) {
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

    this.buildGame = function () {
        document.getElementById("players-info").classList.remove("setup");
        document.getElementById("display-container").style.display = "contents";
        document.getElementById("remote-info").style.display = "block";
        document.getElementById("startup").style.display = "none";
        document.getElementById("play").style.display = "block";
    }

    this.buildDecree = function () {
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

    this.build = function() {
        display.buildDecree();
        display.buildListDeal();
        display.buildDisplayInfo();
        display.buildTrick()
        if (trick.cards.length === 0) {
            if (document.getElementById('leader-checkBox').checked) {
                display.buildResults("trick-leader", "lead the", trick.leadplayer)
            } else {
                trick.start()
            }
        } else {
            trick.resume()
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

window.onclick = function(event) {
    if (!event.target.matches('#scoring-dropdown')) {
        document.getElementById('scoring-dropdown-content').classList.remove('show')
    }
    if (!event.target.matches('#cards-dropdown')) {
        document.getElementById('cards-dropdown-content').classList.remove('show')
    }

    if (!event.target.matches('#rules-dropdown')) {
        document.getElementById('rules-dropdown-content').classList.remove('show')
    }

    if (!event.target.matches('#user-dropdown')) {
        document.getElementById('user-dropdown-content').classList.remove('show')
    }

    if (event.target.matches('.bars')) {
        document.getElementById('user-dropdown-content').classList.toggle('show')
    }

    if (event.target.matches('.modal')) {
        document.getElementById('video-tutorial-modal').style.display = "none"
        document.getElementById('rulebook-modal').style.display = "none"
        document.getElementById('settings-modal').style.display = "none"
        pauseVideo()
    }
}


const tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function onYouTubeIframeAPIReady() {
    const video = new YT.Player('player', {
        height: '390',
        width: '640',
        videoId: 'XTvSyn09KlY',
    });
}


function pauseVideo() {
    video.pauseVideo();
}

$(function(){

    $("#flipbook").turn({
        width: 800,
        height: 592,
        autoCenter: true
    });

})

$('#email').on('submit', function(submit) {
    submit.preventDefault()
    let email = document.getElementById('emailentry').value
    socket.emit('sendcode', {'gameroom': gameroom, 'email': email})
    display.buildEmailSent(email)
    document.getElementById('createcode').style.display = 'none'
    document.getElementById('emailsent').style.display = 'block'

})

$('#entercode').on('submit', function(submit) {
    submit.preventDefault()
    let code = document.getElementById('codeentry').value
    socket.emit('startgame', code)
})
