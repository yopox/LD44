class Starfield {

    constructor(scene) {
        this.scene = scene;
        this.stars = scene.add.group();
        this.PROBA = [0.05, 0.05, 0.03, 0.01];
        this.MIN_SPEED = 0.2;
        this.create(0, 2 * scene.game.config.width, 1);
    }

    scroll(x) {
        // Create new stars
        this.create(2 * this.scene.game.config.width, x, 1/5);

        // Move stars and remove non visible ones
        this.stars.getChildren().forEach(star => {
            star.x -= x * star.updateSpeed;
            if (star.x < -16) {
                this.stars.remove(star);
                star.destroy();
            }
        });

    }

    create(start, range, factor) {
        for (let x = start; x < start + range; x++) {
            for (let i = 0; i < this.PROBA.length; i++) {
                if (Math.random() <= this.PROBA[i] * factor) {
                    var sprite = this.scene.add.sprite(x, this.randomY(), 'stars', i);
                    sprite.updateSpeed = Math.max(Math.random(), this.MIN_SPEED);
                    this.stars.add(sprite);
                }
            }
        }
    }

    randomY() {
        return Math.floor(Math.random() * this.scene.game.config.height);
    }

    destroy() {
        this.stars.destroy(true);
    }

}