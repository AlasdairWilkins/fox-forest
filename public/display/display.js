const forms = {username:
        {id: 'loginselect',
            formId: 'username',
            action: "action='/nologin' method='get'",
            // inputId: 'usernameentry',
            text: 'Enter your display name.',
            default: 'Your name'
            }
}

const playerInfo = {
    name: `{{input}}`,
    game: `{{name}} | Tricks: {{tricks}} | Score: {{score}}`,
}

const turn = {
    display: `It's your turn!`,
    remote: `Waiting for {{input}} to play a card!`
}

const cards = {
    decree: `<img src={{image}} class="card" {{mouseover}}'>`
}

const results = {
    leads: `<div id="trick-leader">{{#if display}}You lead{{else}}{{name}} leads{{/if}} the trick!</div>`,
    trick: `<div id="trick-winner">{{#if display}}You{{else}}{{name}}{{/if}} won the trick!</div>`,
    round: `<div id="round-winner">{{#roundPlayer display}}{{/roundPlayer}}
            {{#roundPlayer remote}}{{/roundPlayer}}</div>`,
}


const startup = {
    home:
        `<button id="ai" onclick="client.clickedAI()">Play against the computer.</button>    
        <button id="human" onclick="display.build('playerstartup', startup, 'twoplayer')">Play against another person.</button>`,
    twoplayer:
        `<button id="creategame" onclick="client.clickedNew()">Get a new game code.</button>
        <button id="joingame" onclick="display.build('playerstartup', startup, 'entercode')">Enter an existing code.</button>`,
    codeoptions:
        `<div id="newcode">Your game code is {{input}}.</div><br>
        <button onclick="display.build('playerstartup', startup, 'emailcode', '{{input}}')">Email the code.</button>
        <button onclick="socket.emit('zulipget')">Invite a Recurser on Zulip.</button>`,
    emailcode:
        `<div id="newcode">Your game code is {{input}}.</div><br>
        <form id="email">
        Enter your opponent's email to send them the code:<br>
        <input id="emailentry" type="text" onfocus="this.value=''" value="Email"><br><br>
        <input type="submit" value="Submit">
        </form>`,
    emailsent:
        `<p id="sentmessage">The game code {{code}} has been sent to {{email}}.</p>
        <button onclick="display.build('playerstartup', startup, 'emailcode', '{{code}}')">Resend email.</button>`,
    zulipcode:
        `<div id="newcode">Your game code is {{input}}.</div><br>
        <form id="zulip">
        Enter your opponent's name to send them the code:<br>
        <input id="zulipentry" type="text" placeholder="Recurser"><br><br>
        <input type="submit" value="Submit">
        </form>`,
    entercode:
        `<form id="code">
        Enter the code you have received to start the game:<br>
        <input id="codeentry" type="text" onfocus="this.value=''" value="Game Code"><br><br>
        <input type="submit" value="Submit">
        </form>`
}

const mechanics = {
    default: `Mouse over any odd-numbered card to see its special ability!`,
    card1: `Swan: If you play this and lose the trick, you lead the next trick.`,
    card3: `Fox: When you play this, you may exchange the decree card with a card from your hand.`,
    card5: `Woodcutter: When you play this, draw 1 card. Then discard any 1 card to the bottom of the deck.`,
    card7: `Treasure: The winner of the trick receives 1 point for each 7 in the trick.`,
    card9: `Witch: When determining the winner of a trick with only one 9, treat the 9 as if it were in the trump suit.`,
    card11: `Monarch: When you lead this, if your opponent has any cards of the same suit, they must play either the 1 or their highest card from that suit.`
}

function Display() {
    this.swan = `Swan: If you play this and lose the trick, you lead the next trick.`;
    this.fox = `Fox: When you play this, you may exchange the decree card with a card from your hand.`;
    this.woodcutter = `Woodcutter: When you play this, draw 1 card. Then discard any 1 card to the bottom of the deck.`;
    this.treasure = `Treasure: The winner of the trick receives 1 point for each 7 in the trick.`;
    this.witch = `Witch: When determining the winner of a trick with only one 9, treat the 9 as if it were in the trump suit.`;
    this.monarch = `Monarch: When you lead this, if your opponent has any cards of the same suit, they must play either the 1 or their highest card from that suit.`;
    this.mechanics = [null, this.swan, null, this.fox, null, this.woodcutter, null, this.treasure, null, this.witch, null, this.monarch]

    this.build = function(parent, directory, value, input) {
        if (input) {
            let template = Handlebars.compile(directory[value])
            let context = new Context(input, value)
            let html = template(context)
            document.getElementById(parent).innerHTML = html
        } else {
           document.getElementById(parent).innerHTML = directory[value]
        }
    }

    this.clear = function(parent) {
        document.getElementById(parent).innerHTML = ''
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

    this.buildPassButton = function (passhtml) {
        document.getElementById("pass").innerHTML = passhtml
    };

    this.buildGame = function() {
        this.showGame()
        let carddata = {image: game.round.decree.image, mouseover: game.round.decree.mouseover}
        this.build('decree-card', cards, 'decree', carddata)
        this.buildListDeal();
        this.buildTrick()
    }

    this.showGame = function () {
        document.getElementById("startup").style.display = "none";
        document.getElementById("play").style.display = "block";
    }

    this.buildTrick = function (zindex) {
        let trick = game.round.trick
        let newarray = trick.cards.map(function (card) {
            let count = trick.cards.indexOf(card) + 1;
            if (count === trick.cards.length) {
                let style = game.displayplayer.setTrickStyle(zindex)
                return `<img src=${card.image} class="card trick${count}" id="${card.id}" ${card.mouseover} style=${style} >`
            } else {
                return `<img src=${card.image} class="card trick${count}" id="${card.id}" ${card.mouseover}'>`
            }

        }).join("");
        document.getElementById("trick-cards").innerHTML = newarray
    };

    this.buildWoodcutterList = function () {
        let handarray = game.displayplayer.hand.map(function (card) {
            let count = game.displayplayer.hand.indexOf(card);
            let style = game.displayplayer.setListStyle(count, count, card);
            return `<img src=${card.image} class="card" id="${card.id}" onclick='game.displayplayer.doWoodcutter(${count})' ${card.mouseover}' style=${style}>`
        }).join("");
        document.getElementById("hand").innerHTML = handarray
    };

    this.buildFoxList = function () {
        let handarray = game.displayplayer.hand.map(function (card) {
            let count = game.displayplayer.hand.indexOf(card)
            let style = game.displayplayer.setListStyle(count, count, card);
            return `<img src=${card.image} class="card" id="${card.id}" onclick='game.displayplayer.doFox(${count})' ${card.mouseover}' style=${style}>`
        }).join("");
        document.getElementById("hand").innerHTML = handarray
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
                return `<img src=${card.image} class="card leftcard" id="${card.id}" ${card.mouseover}' style=${style} >`
            } else {
                return `<img src=${card.image} class="card rightcard" id="${card.id}" ${card.mouseover}' style=${style} >`
            }
        }).join("");
        document.getElementById("hand").innerHTML = handarray

    };

    this.buildListActive = function () {
        let tricksplayed = game.player1.tricks.length + game.player2.tricks.length;
        let handarray = game.displayplayer.hand.map(function (card) {
            let count = game.displayplayer.hand.indexOf(card);
            let style = game.displayplayer.setListStyle(count, count, card);
            if (card.playable) {
                if (card.value === 3 && tricksplayed < 12) {
                    return `<img src=${card.image} class="card" id="${card.id}" onclick='game.displayplayer.doFoxHuman(${count})' ${card.mouseover}' style=${style} >`
                } else if (card.value === 5 && tricksplayed < 12) {
                    return `<img src=${card.image} class="card" id="${card.id}" onclick='game.displayplayer.doWoodcutterHuman(${count})' ${card.mouseover}' style=${style} >`
                } else {
                    return `<img src=${card.image} class="card" id="${card.id}" onclick='game.displayplayer.clicked(${count})' ${card.mouseover}' style=${style} >`
                }
            } else {
                return `<img src=${card.image} class="card" id="${card.id}" style=${style} >`
            }
        }).join("")
        document.getElementById("hand").innerHTML = handarray
    };

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
}