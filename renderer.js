var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

canvas.width = 288;
canvas.height = 512;

var images = ['background', 'bird', 'pipebottom', 'pipetop'];
var imgMap = {};
var bird = {
    X: 100,
    Y: 250
};

window.onmousemove = function(event){
    // bird.Y = event.y;
}

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

var toCreate = 60;
function draw() {
    if (Object.keys(imgMap).length != 4) {
        globalID = requestAnimationFrame(draw);
        return;
    }

    context.drawImage(imgMap['BACKGROUND'], 0, 0, 288, 512);
    toCreate++;

    if (toCreate > 60) {
        toCreate = 0;

        pipes.push({
            X: 288,
            Y: Math.floor(Math.random() * 512)
        });
    }

    for (var key in pipes) {
        var pipe = pipes[key];

        context.drawImage(imgMap['PIPETOP'], pipe.X, pipe.Y - 512, 40, 512);
        context.drawImage(imgMap['PIPEBOTTOM'], pipe.X, pipe.Y + 100, 40, 512);

        if(bird.X + 34 > pipe.X && bird.X < pipe.X + 40){
            if(bird.Y < pipe.Y){
                return;
            }

            if(bird.Y + 24 > pipe.Y + 100) {
                return;
            }
        }

        pipe.X -= 4;

        if (pipe.x + 40 < 0) {
            delete pipes[key];
        }
    }

    context.save();
    context.drawImage(imgMap['BIRD'], bird.X, bird.Y);
    context.restore();

    globalID = requestAnimationFrame(draw);
}

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.beginPath();
}

globalID = requestAnimationFrame(draw);

