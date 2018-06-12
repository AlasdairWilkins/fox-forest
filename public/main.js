const client = new Client()
// const games = client.games
let game
// let round
// let trick
// let player1
// let player2
let gamecode
let addresses

const suits = ['Bells', 'Keys', 'Moons']
const stylesheet = document.documentElement.style
const display = new Display()

display.build('playerstartup', startup, 'home')