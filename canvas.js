canvas = document.getElementById("c1");
ctx = canvas.getContext("2d");
canvas.width = width;
canvas.height = height;

// wait for this, cause game's after 
window.onload = function () {
    
    setInterval(update, framerate);
    setTimeout(draw, framerate);

    music.play();

    window.onkeydown = function (e) {
        setKey(e.keyCode, 1);
        if (e.keyCode < 41 && e.keyCode > 30) {
            e.preventDefault();
        }
    }

    window.onkeyup = function (e) {
        setKey(e.keyCode, 0);
    }
}

function setKey(keycode, updown) {
    // 37 = left
    switch (keycode) {
        case 38:
            keyboard.UP = updown;
            break;
        case 39:
            keyboard.RIGHT = updown;
            break;
        case 40:
            keyboard.DOWN = updown;
            break;
        case 37:
            keyboard.LEFT = updown;
            break;
        case 32:
            keyboard.SPACE = updown;
            break;
    }
}

function showDialog(score) {
    var formdiv = document.getElementById("formdiv");
    if(formdiv.style.display.toLowerCase() !== "block") {
        formdiv.style.display = "block";
        document.getElementById("showscore").innerHTML = score;        
    }
}
