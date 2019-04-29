class Diary extends Phaser.Scene {

    constructor() {
        super('Diary');
        this.transition;
        this.gState;
        this.space;
        this.keySpace;
        this.keyTab;
        this.bitmapText;
        this.text;
        this.fullText;
        this.pos;
        this.frame;
        this.textFrame;
        this.typewriter;
        this.bgm;
        this.TEXT_SPEED = 4;
    }

    create() {
        this.fullText = getLog(this.game.progress);
        this.text = "";
        this.pos = 0;
        this.frame = 0;
        this.textFrame = 0;
        this.gState = GameState.TRANSITION_IN;
        this.typewriter = [];
        this.bgm = this.sound.add('diary');
        this.bgm.setVolume(mute ? 0 : 0.75);
        this.bgm.setLoop(true);
        this.bgm.play();

        for (let i = 1; i < 6; i++) {
            this.typewriter.push(this.sound.add('type' + i));
            this.typewriter[i - 1].volume = 0.5;
        }

        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.keyTab = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TAB);

        this.bitmapText = this.add.bitmapText(32, 12, 'EquipmentPro', "", 24).setOrigin(0);
        this.space = this.add.bitmapText(WIDTH / 2, HEIGHT - 23, 'EquipmentPro', 'Press TAB to skip', 24).setOrigin(0.5, 1);
        this.add.sprite(0, 0, "diary").setOrigin(0);

        this.transition = new Transition(this);
        this.transition.in();
    }

    update() {
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
                    this.scene.start("Planets");
                }
                break;

            default:
                this.textFrame = this.textFrame + 1;
                if (this.textFrame == this.TEXT_SPEED) {
                    this.textFrame = 0;
                    this.updateText();
                }

                if (this.keyTab.isDown) {
                    this.bitmapText.text = this.fullText;
                    this.pos = this.fullText.length;
                    this.space.text = "Press SPACE to continue";
                }
                break;
        }

    }

    updateText() {
        if (this.pos < this.fullText.length) {
            let newChar = this.fullText.charAt(this.pos);
            this.text += newChar;
            if (newChar != ' ' && newChar != '\n') {
                this.type();
            }
            switch (newChar) {
                case '.':
                case ':':
                    this.textFrame = -3 * this.TEXT_SPEED;
                    break;

                case ' ':
                case '\n':
                    this.textFrame = -this.TEXT_SPEED / 2;
                    break;
            }
            this.bitmapText.text = this.text;
            this.pos++;
            if (this.pos == this.fullText.length) {
                this.space.text = "Press SPACE to continue";
            }
        } else {
            if (this.keySpace.isDown) {
                this.gState = GameState.TRANSITION_OUT;
                this.transition.out();
            }
        }
    }

    type() {
        let rand = Math.floor(this.typewriter.length * Math.random());
        this.typewriter[rand].play();
    }

}