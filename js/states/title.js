class Title extends Phaser.Scene {

    constructor() {
        super('Title');
        this.space;
        this.frame;
        this.spaceBar;
        this.starfield;
        this.transition;
        this.gState;
        this.bgm;
    }

    init() {
    }

    create() {
        this.game.progress = new Progress();

        this.gState = GameState.TRANSITION_IN;
        this.frame = 0;
        this.bgm = this.sound.add('planets');
        this.bgm.setVolume(mute ? 0 : 0.75);
        this.bgm.setLoop(true);
        this.bgm.play();

        this.starfield = new Starfield(this);

        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.add.bitmapText(WIDTH / 2, HEIGHT / 4, 'EquipmentPro', 'Slave Odyssey', 60).setOrigin(0.5);
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
                this.bgm.volume = Math.max(0, this.bgm.volume - 0.015);
                if (this.transition.ended) {
                    this.bgm.stop();
                    this.starfield.destroy();
                    this.scene.start(this.game.progress.resume ? "Planets" : "Diary");
                    this.game.progress.resume = true;
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