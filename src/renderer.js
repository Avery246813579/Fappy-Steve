var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

var FPS = document.getElementById('FPS');
var UPDATES = document.getElementById('UPDATES');

canvas.width = 288;
canvas.height = 512;

var images = ['background', 'bird', 'pipebottom', 'pipetop'];
var imgMap = {};
//var bird = {
//    X: 100,
//    Y: 250
//};

var birds = [
    new Bird()
];

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

var lastTime = new Date().getTime(), tick = new Date().getTime();
var delta = 0, targetUps = 1000 / 60, frames = 0, updates = 0;
function draw() {
    context.drawImage(imgMap['BACKGROUND'], 0, 0, 288, 512);

    for (var key in pipes) {
        if (pipes.hasOwnProperty(key)) {
            var pipe = pipes[key];

            context.drawImage(imgMap['PIPETOP'], pipe.X, pipe.Y - 512, 40, 512);
            context.drawImage(imgMap['PIPEBOTTOM'], pipe.X, pipe.Y + 100, 40, 512);

            pipe.X -= 2;

            if (pipe.X + 40 < 0) {
                pipes.splice(key, 1);
            }
        }
    }

    for (var i = 0; i < birds.length; i++) {
        birds[i].draw(context);
    }
}

var GOD_MODE = false;
function update() {
    toCreate++;

    if (toCreate > 90) {
        toCreate = 0;

        pipes.push({
            X: 288,
            Y: Math.floor(Math.random() * 400)
        });
    }

    //Our magic number is 90 and 70, but computer has to find that.
    for (var i = 0; i < birds.length; i++) {
        var bird = birds[i];
        var location = bird.location;

        bird.tick();
        if (Object.keys(pipes).length > 0) {
            var closestPipe = pipes[Object.keys(pipes)[0]];

            if (location.X > closestPipe.X + 45) {
                closestPipe = pipes[Object.keys(pipes)[1]];
            }

            var d = Math.sqrt((closestPipe.X - location.X) * (closestPipe.X - location.X) + (closestPipe.Y - location.Y) * (closestPipe.Y - location.Y));

            console.log(d);
            if (d > 90 && location.Y - 24 > closestPipe.Y) {
                bird.jump();
            } else  if (d > 70 && d < 90 && location.X + 34 > closestPipe.X) {
                bird.jump();
            }
        }
    }

    for (var key in pipes) {
        if (pipes.hasOwnProperty(key)) {
            var pipe = pipes[key];

            for (var j = 0; j < birds.length; j++) {
                (function () {
                    var bird = birds[j];
                    var location = bird.location;

                    //Hitbox
                    if (location.X + 34 > pipe.X && location.X < pipe.X + 40) {
                        if (location.Y < pipe.Y) {
                            if (!GOD_MODE) {
                                birds.splice(j, 1);
                            }
                        } else if (location.Y + 24 > pipe.Y + 100) {
                            if (!GOD_MODE) {
                                birds.splice(j, 1);
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


function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.beginPath();
}

globalID = requestAnimationFrame(render);

