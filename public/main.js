

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

function clickedAI() {
    player1 = new Player("Alasdair", socket.id);
    $.post("/computername", null, function (data, status) {
        player2 = new Player(data['name']);
        game = new Game(true, player1, player2);
        document.getElementById("players-info").classList.toggle("setup");
        document.getElementById("display-container").style.display = "contents";
        document.getElementById("remote-info").style.display = "block";
        document.getElementById("startup").style.display = "none";
        document.getElementById("play").style.display = "block";
        // document.getElementById("chat-dropdown").style.display = "block";
        game.setEventListeners()
        display.buildDisplayInfo();
        round = new Round(player1, player2)
        round.start();
        if (document.getElementById('leader-checkBox').checked) {
            display.buildResults("trick-leader", "lead the", trick.leadplayer)
        } else {
            trick.start()
        }
    })

}

function clicked2P() {
    document.getElementById("playerstartup").style.display = "none";
    document.getElementById("twoplayer").style.display = "block";
}

function clickedNew() {
    console.log('Got here!')
    socket.emit('2pgame', "I'd like to start a game.")
}

socket.on('gamecode', function(msg) {
    gameroom = msg
    display.buildGameCode(msg)
    document.getElementById("twoplayer").style.display = "none";
    document.getElementById("createcode").style.display = "block";
    document.getElementById("email").style.display = "block"
})

socket.on('startup')

socket.on('gamebeginning')

socket.on('startupinfo', function(msg) {
    player1 = new Player('Alasdair', msg['player1'])
    player2 = new Player('Kaley', msg['player2'])
    let cookie = "id=" + msg['player1']
    if (cookie === document.cookie) {
        game = new Game(false, player1, player2)
    } else {
        game = new Game(false, player2, player1)
    }
    round = new Round(player1, player2)
    document.getElementById("players-info").classList.toggle("setup");
    document.getElementById("display-container").style.display = "contents";
    document.getElementById("remote-info").style.display = "block";
    document.getElementById("startup").style.display = "none";
    document.getElementById("play").style.display = "block";
    game.setEventListeners()
    game.start2p(msg)
    display.build2p()
})

socket.on('newround', function(msg) {
    if (round.dealplayer.id === player1.id) {
        round = new Round(player2, player1)
        trick.leadplayer = player1
    } else {
        round = new Round(player1, player2)
        trick.leadplayer = player2
    }
    game.start2p(msg)
    display.build2p()
})

socket.on('turninfo', function(msg) {
    console.log(msg)
    if (round.decree != msg['decree']) {
        round.decree = msg['decree'];
        display.buildDecree();
    }
    trick.cards = msg['trick'];
    trick.play()
})

socket.on('trickresults', function(msg) {
    console.log(msg)
    game.displayplayer.receiveScores(msg, 0)
})

socket.on('resumegame', function(msg) {
    console.log(msg)
})

socket.on('announcement', function(msg) {
    console.log(msg)
})

socket.on('roundresults', function(msg) {
    display.clearTurn()
    player1.score = msg['p1score']
    player1.roundResult = msg['p1result']
    player2.score = msg['p2score']
    player2.roundResult = msg['p2result']
    if (document.getElementById('score-checkBox').checked) {
        display.buildResults("round-winner")
    } else {
        round.end()
    }
})

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

//onmouseover="display.buildMechanic('${card.mechanic}')" onmouseout='display.clearMechanic()'

// $(".card").hover(display.buildMechanic(event.target.id), display.clearMechanic())