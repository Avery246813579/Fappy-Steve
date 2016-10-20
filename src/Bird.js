// Terminal Velocity is in Magnitude
var TERMINAL_VELOCITY = 25;
var GRAVITY = .5;

function Bird() {
    this.location = {
        X: 100,
        Y: 50
    };

    this.velocity = {
        Y: 0
    };

    this.jump = function () {
        if (this.velocity.Y < 0) {
            this.velocity.Y = 0;
        }

        this.velocity.Y = -7.5;
    };

    this.tick = function () {
        this.location.Y += this.velocity.Y;
        this.velocity.Y += GRAVITY;

        if (this.velocity.Y > 5) {
            this.velocity.Y = 5;
        }

        if (Math.abs(this.velocity.Y) > TERMINAL_VELOCITY) {
            if (this.velocity > 0) {
                this.velocity = TERMINAL_VELOCITY;
            } else {
                this.velocity = -TERMINAL_VELOCITY;
            }
        }
    };

    this.draw = function (context) {
        context.save();

        var img = imgMap['BIRD'];
        context.translate(this.location.X, this.location.Y);
        context.translate(img.width / 2, img.height / 2);

        if (this.velocity.Y < 0) {
            context.rotate(-.35);
        }

        if (this.velocity.Y > 2) {
            context.rotate(Math.PI/2 * this.location.Y / 365);
        }

        context.drawImage(imgMap['BIRD'], -1 * img.width / 2, -1 * img.height / 2);
        context.restore();
    };

    (function Constructor(first) {
    }).apply(this, arguments);
}