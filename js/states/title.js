class Title extends Phaser.Scene {

    constructor() {
        super('Title');
        this.space;
        this.frame;
        this.spaceBar;
        this.starfield;
        this.transition;
        this.gState;
    }

    init() {
    }

    create() {
        this.gState = GameState.TRANSITION_IN;
        this.frame = 0;

        this.starfield = new Starfield(this);

        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.add.bitmapText(WIDTH / 2, HEIGHT / 4, 'EquipmentPro', 'Space Shooterz', 60).setOrigin(0.5);
        this.space = this.add.bitmapText(WIDTH / 2, 3 * HEIGHT / 4, 'EquipmentPro', 'Press SPACE to begin', 24).setOrigin(0.5);

        this.transition = new Transition(this);
        this.transition.in();
    }

    update() {
        this.starfield.scroll(8);

        this.frame = (this.frame + 1) % 120;
        this.space.alpha = (60 - Math.abs(this.frame - 60)) / 60;

        switch (this.gState) {
            case GameState.TRANSITION_IN:
                if (this.transition.ended) {
                    this.gState = GameState.MAIN;
                }
                break;
            
            case GameState.TRANSITION_OUT:
                if (this.transition.ended) {
                    this.starfield.destroy();
                    this.scene.start("Diary");
                }
                break;
        
            default:
                if (this.spaceBar.isDown) {
                    this.gState = GameState.TRANSITION_OUT;
                    this.transition.out();
                }
                break;
        }

    }

}