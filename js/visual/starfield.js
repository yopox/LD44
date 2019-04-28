class Starfield {

    constructor(scene) {
        this.scene = scene;
        this.stars = scene.add.group();
        this.PROBA = [0.025, 0.025, 0.015, 0.015, 0.005];
        this.MIN_SPEED = 0.1;
        this.create(0, 2 * WIDTH, 1);
        this.frame = 0;
    }

    scroll(x) {
        // Create new stars
        this.create(2 * WIDTH, x, 1);

        // Move stars
        this.stars.getChildren().forEach(star => {
            star.x = star.x - x * star.updateSpeed;
        });

        // Remove non visible ones
        this.frame = (this.frame + 1) % 30;
        if (this.frame == 0) {
            this.stars.getChildren().forEach(star => {
                if (star.x < -16) {
                    this.stars.remove(star, true, true);
                }
            });
        }

    }

    create(start, range, factor) {
        for (let x = start; x < start + range; x++) {
            for (let i = 0; i < this.PROBA.length; i++) {
                if (Math.random() <= this.PROBA[i] * factor) {
                    var sprite = this.scene.add.sprite(x, this.randomY(), 'stars', i);
                    sprite.updateSpeed = Math.max(Math.random(), this.MIN_SPEED);
                    sprite.setScrollFactor(0);
                    sprite.setDepth(-1);
                    this.stars.add(sprite);
                }
            }
        }
    }

    randomY() {
        return Math.floor(Math.random() * HEIGHT);
    }

    destroy() {
        this.stars.destroy(true);
    }

}