const style = document.documentElement.style;

var x = Math.floor(Math.random()*100)
var newvalue = x + '%'

style.setProperty('--tx', newvalue)

var image = document.getElementById('bells1')
console.log(image.getBoundingClientRect())