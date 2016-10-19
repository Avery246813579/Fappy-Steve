var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

canvas.width = 288;
canvas.height = 512;

var images = ['background', 'bird', 'pipebottom', 'pipetop'];
var imgMap = {};
for(var i = 0; i < images.length; i++){
    (function() {
        var img = new Image();
        img.src = "assets/images/" + images[i] + ".png";

        var name = images[i];
        img.onload = function () {
            console.log("Loaded: " + name);

            imgMap[name.toUpperCase()] = img;
        }
    })();
}

var globalID;
var pipes = [{
    X: 100,
    Y: 20
}];

var toCreate = 0;
function draw(){
    if(Object.keys(imgMap).length != 4){
        globalID = requestAnimationFrame(draw);
        return;
    }

    context.drawImage(imgMap['BACKGROUND'], 0, 0, 288, 512);

    for(var key in pipes){
        var pipe = pipes[key];

        context.drawImage(imgMap['PIPETOP'], pipe.X, pipe.Y - 512, 40, 512);
        context.drawImage(imgMap['PIPEBOTTOM'], pipe.X, pipe.Y + 100, 40, 512);

        pipe.X -= 4;

        if(pipe.x + 40 < 0){
            delete pipes[key];
        }
    }

    globalID = requestAnimationFrame(draw);
}

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.beginPath();
}

globalID = requestAnimationFrame(draw);

