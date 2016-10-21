var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

var FPS = document.getElementById('FPS');
var UPDATES = document.getElementById('UPDATES');
var GEN = document.getElementById('GEN');
var SCORE = document.getElementById('SCORE');
var RANGE = 40;
var score = 1;

canvas.width = 288;
canvas.height = 512;

var images = ['background', 'bird', 'pipebottom', 'pipetop'];
var imgMap = {};
//var bird = {
//    X: 100,
//    Y: 250
//};

var birds = [];
var genBirds;

for (var j = 0; j < 25; j++) {
    birds.push(new Bird());
}

//birds.push(new Bird(70, 90));

window.onmousemove = function (event) {
    //bird.Y = event.y;
    //console.dir(event.y);
};

window.onclick = function (event) {
    for (var b = 0; b < birds.length; b++) {
        (function () {
            var bird = birds[b];

            bird.jump();
        })();
    }
};

window.on = function (event) {
    for (var b = 0; b < birds.length; b++) {
        (function () {
            var bird = birds[b];

            bird.jump();
        })();
    }
};

for (var i = 0; i < images.length; i++) {
    (function () {
        var img = new Image();
        img.src = "assets/images/" + images[i] + ".png";

        var name = images[i];
        img.onload = function () {
            // console.log("Loaded: " + name);

            imgMap[name.toUpperCase()] = img;
        }
    })();
}

var globalID;
var pipes = [];

var toCreate = 45;
var generation = 0;

var lastTime = new Date().getTime(), tick = new Date().getTime();
var delta = 0, targetUps = 1000 / 60, frames = 0, updates = 0;
function draw() {
    context.drawImage(imgMap['BACKGROUND'], 0, 0, 288, 512);

    for (var key in pipes) {
        if (pipes.hasOwnProperty(key)) {
            var pipe = pipes[key];

            context.drawImage(imgMap['PIPETOP'], pipe.X, pipe.Y - 512, 40, 512);
            context.drawImage(imgMap['PIPEBOTTOM'], pipe.X, pipe.Y + 100, 40, 512);
        }
    }

    for (var i = 0; i < birds.length; i++) {
        if (birds[i].isDead()) {
            continue;
        }

        birds[i].draw(context);
    }
}

var GOD_MODE = false;
function update() {
    toCreate++;
    score++;

    if (toCreate > 90) {
        toCreate = 0;

        pipes.push({
            X: 288,
            Y: Math.floor(Math.random() * 400)
        });
    }

    SCORE.innerHTML = "Score: " + score;

    //Our magic number is 90 and 70, but computer has to find that.
    for (var i = 0; i < birds.length; i++) {
        var bird = birds[i];
        var location = bird.location;

        if (bird.isDead()) {
            continue;
        }

        bird.tick();

        //Make this first
        if (Object.keys(pipes).length > 0) {
            var closestPipe = pipes[Object.keys(pipes)[0]];


            if (location.X > closestPipe.X + 45) {
                closestPipe = pipes[Object.keys(pipes)[1]];
            }

            var d = Math.sqrt((closestPipe.X - location.X) * (closestPipe.X - location.X) + (closestPipe.Y - location.Y) * (closestPipe.Y - location.Y));

            if (d > bird.strength.MAX && location.Y - 24 > closestPipe.Y) {
                bird.jump();
            } else if (d > bird.strength.MIN && d < bird.strength.MAX && location.X + 34 > closestPipe.X) {
                bird.jump();
            }
        } else {
            var jump = Math.floor(Math.random() * 15);

            if (jump == 0) {
                bird.jump();
            }
        }
    }

    for (var key in pipes) {
        if (pipes.hasOwnProperty(key)) {
            var pipe = pipes[key];

            if (pipe.X + 40 < 0) {
                pipes.splice(key, 1);
                continue;
            }

            pipe.X -= 2;

            if (!isAliveBird()) {
                nextGeneration();
                return;
            }

            for (var j = 0; j < birds.length; j++) {
                if (birds[j].isDead()) {
                    continue;
                }

                (function () {
                    var bird = birds[j];
                    var location = bird.location;

                    //Hitbox
                    if (location.X + 34 > pipe.X && location.X < pipe.X + 40) {
                        if (location.Y < pipe.Y) {
                            if (!GOD_MODE) {
                                bird.addScore(score);
                                bird.dead = true;
                            }
                        } else if (location.Y + 24 > pipe.Y + 100) {
                            if (!GOD_MODE) {
                                bird.addScore(score);
                                bird.dead = true;
                            }
                        }
                    }
                })();
            }
        }
    }
}

function render() {
    if (Object.keys(imgMap).length != 4) {
        globalID = requestAnimationFrame(render);
        return;
    }

    var now = new Date().getTime();
    delta += (now - lastTime) / targetUps;
    lastTime = now;

    if (delta >= 1) {
        updates++;
        delta--;

        update();
    }

    draw();
    frames++;

    if (now - tick > 1000) {
        tick = now;
        FPS.innerHTML = "FPS: " + frames;
        UPDATES.innerHTML = "UPDATES: " + updates;
        frames = 0;
        updates = 0;
    }

    globalID = requestAnimationFrame(render);
}

function isAliveBird() {
    for (var i = 0; i < birds.length; i++) {
        if (!birds[i].isDead()) {
            return true;
        }
    }

    return false;
}

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.beginPath();
}

function nextGeneration() {
    generation++;
    score = 0;

    //Every third generation we take the top 5 scorers and we create 4 children for each parent
    if (generation % 2 == 0) {
        genBirds = birds.splice(0);

        sort();

        for(var j = 0; j < 5; j++){
            var bird = genBirds[j];
            console.log(bird.score + " " + bird.strength.MIN + " " + bird.strength.MAX);

            genBirds[4 + (j * 5)].strength = {MIN: bird.strength.MIN + Math.floor(Math.random() * RANGE - RANGE / 2), MAX: bird.strength.MAX + Math.floor(Math.random() * RANGE - RANGE / 2)};
            genBirds[4 + (j * 5)].strength = {MIN: bird.strength.MIN + Math.floor(Math.random() * RANGE - RANGE / 2), MAX: bird.strength.MAX + Math.floor(Math.random() * RANGE - RANGE / 2)};
            genBirds[4 + (j * 5)].strength = {MIN: bird.strength.MIN + Math.floor(Math.random() * RANGE - RANGE / 2), MAX: bird.strength.MAX + Math.floor(Math.random() * RANGE - RANGE / 2)};

            //Try to find a different optimal route
            genBirds[4 + (j * 5)].strength = {MIN: bird.strength.MIN + Math.floor(Math.random() * (RANGE * 2.5) - (RANGE * 2.5) / 2), MAX: bird.strength.MAX + Math.floor(Math.random() * (RANGE * 2.5) - (RANGE * 2.5) / 2)};
        }

        for(var h = 0; h < genBirds.length; h++){
            genBirds[h].hardReset();
        }


        birds = genBirds;
    }

    for (var i = 0; i < birds.length; i++) {
        birds[i].reset();
    }

    GEN.innerHTML = "Generation: " + (generation);

    pipes = [];
}

function sort(){
    genBirds.sort(function(a, b) {
        return parseFloat(b.score) - parseFloat(a.score);
    });
}

globalID = requestAnimationFrame(render);

