class Title extends Phaser.Scene {

    constructor() {
        super('Title');
        this.space;
        this.frame = 0;
        this.spaceBar;
        this.starfield;
        this.transition;
        this.gState = GameState.MAIN;
    }

    init() {
    }

    create() {
        this.starfield = new Starfield(this);

        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.add.bitmapText(WIDTH / 2, HEIGHT / 4, 'EquipmentPro', 'Space Shooterz', 60).setOrigin(0.5);
        this.space = this.add.bitmapText(WIDTH / 2, 3 * HEIGHT / 4, 'EquipmentPro', 'Press SPACE', 30).setOrigin(0.5);

        this.transition = new Transition(this);
    }

    update() {
        this.starfield.scroll(8);
        console.log(this.transition.ended);
        

        this.frame = (this.frame + 1) % 120;
        this.space.alpha = (60 - Math.abs(this.frame - 60)) / 60;

        if (this.spaceBar.isDown && this.gState == GameState.MAIN) {
            this.gState = GameState.TRANSITION_OUT;
            this.transition.out();
        }

        else if (this.gState == GameState.TRANSITION_OUT && this.transition.ended) {
            console.log('Check !');
            
            this.starfield.destroy();
            this.scene.start("Level");
        }

    }

}