class Title extends Phaser.Scene {

    constructor() {
        super('Title');
        this.space;
        this.frame = 0;
        this.spaceBar;
    }

    init() {
    }

    create() {
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.add.bitmapText(game.config.width / 2, game.config.height / 4, 'EquipmentPro', 'Space Shooterz', 60).setOrigin(0.5);
        this.space = this.add.bitmapText(game.config.width / 2, 3* game.config.height / 4, 'EquipmentPro', 'Press SPACE', 30).setOrigin(0.5);
    }

    update() {
        this.frame = (this.frame + 1) % 120;
        this.space.alpha = (60 - Math.abs(this.frame - 60)) / 60;

        if (this.spaceBar.isDown) {
            this.scene.start("Level");
        }

    }

    resetScene() {
    }

}