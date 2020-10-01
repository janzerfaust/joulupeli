var width = 800;
var height = 600;

var fps = 60;
var framerate = 1 / fps * 1000;

var ctxIndex = 1;

var speedBuffTime = 3000;
var speedBuffMaxTime = 3000;
var spawnRate = 0;

var score = 0;
var misses = 0;
var maxMisses = 5;

var gameover = false;

// load
var hillsImage = loadImage("images/background/hills.png");
var cloudsImage = loadImage("images/background/clouds.png");
var starsImage = loadImage("images/background/stars.png");
var starsImage2 = loadImage("images/background/stars2.png");
var santaImage = loadImage("images/objects/santa.png");
var speedBuffImage = loadImage("images/objects/speedbuff.png")
var presentImage = loadImage("images/objects/present.png");
var houseImage = loadImage("images/objects/house1.png");
var arrowImage = loadImage("images/objects/arrow.png");

var music = loadAudio("sounds/music.mp3");
var stampSound = loadAudio("sounds/stamp.wav");
var presentHitSound = loadAudio("sounds/presenthit.wav");
var lostSound = loadAudio("sounds/lost.wav");
var throwSound = loadAudio("sounds/throw.wav");
var speedSound = loadAudio("sounds/speed.wav");

var lostSoundPlayed = false;

music.loop = true;

// variables, objects
var presents = [];
var buffs = [];
var houses = [];

var ground = {
    color : "white",
    height: 20
};

var arrow = {
    image: arrowImage,
    asc : true,
    degree: 0,
    speed: 3,
    maxDegree: 75,
    updateDegree: function (modifier) {
        if(this.asc) {
            this.degree += this.speed * modifier;
        }
        else {
            this.degree -= this.speed * modifier;
        }

        if(this.degree >= this.maxDegree) {
            this.asc = false;
        }
        else if(this.degree <= -this.maxDegree) {
            this.asc = true;
        }
    }
}

var houseMachine = {
    minDistance: 1000,
    maxDistance: 16000,
    lastDistance : 0
}

var backgrounds = [
    background = {
        image: starsImage,
        pos: { x: -800, y: 0 },
        speed: 2
    },
    background = {
        image: starsImage2,
        pos: { x: -800, y: 0 },
        speed: 1.4
    },
    background = {
        image: cloudsImage,
        pos: { x: -800, y: 0 },
        speed: 3
    },
    background = {
        image: hillsImage,
        pos: { x: -800, y: 0 },
        speed : 8
    }

];


var santa = {
    image: santaImage,
    pos: { x: 380, y: 100 },
    size: { x: 40, y: 40 },
    dir: { x: 0, y: 0 },
    speed: 15,
    speedModifier: 1,
    presentCDMs: 1000,
    lastPresent : 0
};

// keyboard "enum"
var keyboard = {
    UP: 0,
    LEFT: 0,
    DOWN: 0,
    RIGHT: 0,
    SPACE: 0
}

function loadImage(url) {
    var img = new Image();
    img.src = url;
    return img;
}

function loadAudio(url) {
    return new Audio(url);
}