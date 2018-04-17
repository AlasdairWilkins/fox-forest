function changeparent() {
    console.log("Success!")
    var image = document.getElementById("bells1")
    var newparent = document.getElementById("newparent")
    newparent.appendChild(image)
    document.getElementById("bells1").style.top = "300px"
    document.getElementById("bells1").style.top = "0px"
}

margin = Math.floor(Math.random() * 400)
console.log(margin)

document.getElementById("bells1").style.marginLeft = `${margin}px`