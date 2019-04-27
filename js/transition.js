class Transition {

    constructor(scene) {
        this.scene = scene;
        this.r1 = scene.add.rectangle(0, HEIGHT, WIDTH, HEIGHT / 2, 0xffffff).setOrigin(0);
        this.r2 = scene.add.rectangle(0, HEIGHT, WIDTH, HEIGHT / 2, 0xffffff).setOrigin(0);
        this.TIME = 500;
        this.ended = false;
    }

    out() {
        this.r1.y = -HEIGHT / 2;
        this.r2.y = HEIGHT;

        this.scene.tweens.add({
            targets: this.r1,
            y: 0,
            ease: 'Power2',
            duration: 750,
            onComplete: this.endTransition,
            onCompleteParams : [this]
        });
        this.scene.tweens.add({
            targets: this.r2,
            y: HEIGHT / 2,
            ease: 'Power2',
            duration: 750
        });
        
    }

    endTransition(a, b, c) {
        c.ended = true;
    }

}