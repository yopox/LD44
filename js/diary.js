class Diary extends Phaser.Scene {

    constructor() {
        super('Diary');
        this.transition;
        this.gState;
        this.space;
        this.bitmapText;
        this.text;
        this.fullText;
        this.pos;
        this.frame;
        this.textFrame;
        this.typewriter;
        this.bgm;
        this.TEXT_SPEED = 5;
    }

    create() {
        this.fullText = "DIARY - DAY ONE;\nI was sent on a strange system...\nI hope everything will be fine !";
        this.text = "";
        this.pos = 0;
        this.frame = 0;
        this.textFrame = 0;
        this.gState = GameState.TRANSITION_IN;
        this.typewriter = [];
        this.bgm = this.sound.add('diary');
        this.bgm.setVolume(0.6);
        this.bgm.setLoop(true);
        this.bgm.play();

        for (let i = 1; i < 6; i++) {
            this.typewriter.push(this.sound.add('type' + i));
            this.typewriter[i-1].volume = 0.5;
        }

        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
        this.bitmapText = this.add.bitmapText(48, 16, 'EquipmentPro', "", 24).setOrigin(0);
        this.space = this.add.bitmapText(WIDTH / 2, HEIGHT - 24, 'EquipmentPro', 'Press SPACE to continue', 24).setOrigin(0.5, 1);
        this.space.visible = false;
        this.add.sprite(0, 0, "diary").setOrigin(0);

        this.transition = new Transition(this);
        this.transition.in();
    }

    update() {

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
                this.frame = (this.frame + 1) % 120;
                this.space.alpha = (60 - Math.abs(this.frame - 60)) / 60;
                
                this.textFrame = this.textFrame + 1;
                if (this.textFrame == this.TEXT_SPEED) {
                    this.textFrame = 0;
                    this.updateText();
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
                    this.textFrame = -2 * this.TEXT_SPEED;
                    break;

                case ' ':
                    this.textFrame = -this.TEXT_SPEED;
                    break;
                    
                case '\n':
                    this.textFrame = -4 * this.TEXT_SPEED;
                    break;
            }
            this.bitmapText.text = this.text;
            this.pos++;
            if (this.pos == this.fullText.length) {
                this.space.visible = true;
                this.space.alpha = 0;
                this.frame = 0;
            }
        } else {
            if (this.spaceBar.isDown) {
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