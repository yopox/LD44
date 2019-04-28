class Planets extends Phaser.Scene {

    constructor() {
        super('Planets');
        this.transition;
        this.gState;
        this.keySpace;
        this.cursors;
        this.bitmapText;
        this.POSITIONS = [[85, 247], [221, 182], [227, 296], [317, 198], [422, 169], [451, 103], [533, 187]];
        this.DESCRIPTIONS = [
            "SHOP",
            "PLANET X54 - EASY",
            "LEVEL 3 - EASY",
            "LEVEL 4 - HARD",
            "LEVEL 5 - EASY",
            "LEVEL 6 - EASY",
            "LEVEL 7 - EASY",
        ]
        this.position;
        this.cursors;
        this.frame;
        this.cooldown;
    }

    create() {
        this.gState = GameState.TRANSITION_IN;
        this.frame = 0;
        this.bgm = this.sound.add('planets');
        this.bgm.setVolume(0.6);
        this.bgm.setLoop(true);
        this.bgm.play();
        
        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.cursors = this.input.keyboard.createCursorKeys();
        
        this.bitmapText = this.add.bitmapText(310, 40, 'EquipmentPro', "", 24).setOrigin(0.5);
        this.add.sprite(0, 0, "map").setOrigin(0);
        
        this.position = 0;
        this.cursor = this.add.sprite(0, 0, 'cursor', 0).setOrigin(0.5);
        this.updateCursor();
        this.cooldown = 0;
        

        this.transition = new Transition(this);
        this.transition.in();
    }

    update() {

        this.frame = (this.frame + 1) % 60;
        this.cursor.setFrame(this.frame < 30 ? 0 : 1);
        this.cooldown = this.cooldown > 0 ? this.cooldown - 1 : this.cooldown;

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
                    this.scene.start("Level");
                }
                break;

            default:
                if (this.keySpace.isDown) {
                    this.gState = GameState.TRANSITION_OUT;
                    this.transition.out();
                } else if (this.cursors.right.isDown && !this.cooldown) {
                    this.position = mod(this.position + 1, this.POSITIONS.length);
                    this.updateCursor();
                } else if (this.cursors.left.isDown && !this.cooldown) {
                    this.position = mod(this.position - 1, this.POSITIONS.length);
                    this.updateCursor();
                }
                break;
        }

    }

    updateCursor() {
        this.cooldown = 15;
        let pos = this.POSITIONS[this.position];
        this.cursor.x = pos[0];
        this.cursor.y = pos[1];
        this.bitmapText.text = this.DESCRIPTIONS[this.position];
    }

}