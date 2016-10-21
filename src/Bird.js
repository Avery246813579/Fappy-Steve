// Terminal Velocity is in Magnitude
var TERMINAL_VELOCITY = 25;
var GRAVITY = .5;

function Bird() {
    this.dead = false;
    this.score = 0;

    this.location = {
        X: 100,
        Y: 50
    };

    this.velocity = {
        Y: 0
    };

    this.strength = {
        MIN: 70,
        MAX: 90
    };

    this.hardReset = function(){
        this.score = 0;
    };

    this.addScore = function (amount) {
        this.score += amount;
    };

    this.reset = function(){
        this.dead = false;
        this.location.X = 100;
        this.velocity.Y = 0;

        self.location.Y = Math.floor(Math.random() * 512);
    };

    this.isDead = function(){
        return this.dead;
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

        if (this.velocity.Y > 7.5) {
            this.velocity.Y = 7.5;
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
            context.rotate(Math.toRadians(-35));
        }

        if (this.velocity.Y > 2) {
            context.rotate(Math.toRadians(this.location.Y / (GRAVITY * 12)));
        }

        context.drawImage(imgMap['BIRD'], -1 * img.width / 2, -1 * img.height / 2);
        context.restore();
    };

    (function Constructor(min, max) {
        var self = this;

        self.location.Y = Math.floor(Math.random() * 512);

        if(typeof min == "undefined" || typeof max == "undefined") {
            self.strength.MIN = Math.floor(Math.random() * 400);
            self.strength.MAX = Math.floor(Math.random() * 400);
            return;
        }

        self.strength.MIN = min;
        self.strength.MAX = max;
    }).apply(this, arguments);
}