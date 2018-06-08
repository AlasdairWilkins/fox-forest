
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

$('#playerstartup').on('submit', '#email', function(submit) {
    console.log("Hello!")
    submit.preventDefault()
    let email = document.getElementById('emailentry').value
    let input = {email: email, code: gamecode}
    // socket.emit('sendcode', input)
    display.build('playerstartup', startup, 'emailsent', input)

})

$('#playerstartup').on('submit', '#code', function(submit) {
    submit.preventDefault()
    let code = document.getElementById('codeentry').value
    socket.emit('join2p', code)
})

$('#playerstartup').on('submit', '#zulip', function(submit) {
    submit.preventDefault()
    let zulip = document.getElementById('zulipentry').value
    let address = addresses[zulip]
    socket.emit('zulipsend', {address: address, code: gamecode, name: client.name})
})

document.getElementById("trick-leader").addEventListener("animationend", function () {
    document.getElementById("trick-leader").style.display = "none";
    trick.start()
})

document.getElementById("trick-winner").addEventListener("animationend", function () {
    document.getElementById("trick-winner").style.display = "none";
    trick.end()
})

document.getElementById("round-winner").addEventListener("animationend", function () {
    document.getElementById("round-winner").style.display = "none"
    round.end()
})