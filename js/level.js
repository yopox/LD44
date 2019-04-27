class Level extends Phaser.Scene {

    constructor() {
        super('Level');
    }

    init() {
    }

    create() {
        game.config.width = 3200;// setSize(3200, 600);
        //  The world is 3200 x 600 in size
        this.cameras.main.setBounds(0, 0, 3200, 600);

        this.cameras.main.scrollX = 10;

        //  The miniCam is 400px wide, so can display the whole world at a zoom of 0.2
        // this.minimap = this.cameras.add(200, 10, 400, 100).setZoom(0.2);
        // this.minimap.setBackgroundColor(0x002244);
        // this.minimap.scrollX = 1600;
        // this.minimap.scrollY = 300;

        this.cursors = this.input.keyboard.createCursorKeys();

        this.player = new Player(
            this,
            200,
            this.game.config.height * 0.5,
            "sprPlayer"
        );
    }

    update() {
        this.player.update();
        if (this.cursors.up.isDown) {
            this.player.moveUp();
        }
        else if (this.cursors.down.isDown) {
            this.player.moveDown();
        }
        else {
            this.player.stopY()
        }
        if (this.cursors.left.isDown) {
            this.player.moveLeft();
        }
        else if (this.cursors.right.isDown) {
            this.player.moveRight();
        }
        else {
            this.player.stopX()
        }
        this.cameras.main.scrollX += 1;
    }

    resetScene() {
    }

}