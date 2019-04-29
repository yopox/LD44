class Shop extends Phaser.Scene {

    constructor() {
        super('Shop');
        this.transition;
        this.gState;
        this.bgm;
        this.bg;

        this.pos;
        this.bitmapText;
        this.text;
        this.fullText;
        this.textFrame;
        this.TEXT_SPEED = 2;
        this.cursor;
        this.cursorText;
        this.cooldown;

        this.keySpace;
        this.cursors;
    }

    create() {
        this.gState = GameState.TRANSITION_IN;
        this.bg = this.add.sprite(0, 0, "shop").setOrigin(0);
        this.bgm = this.sound.add('shop');
        this.bgm.setVolume(mute ? 0 : 0.75);
        this.bgm.setLoop(true);
        this.bgm.play();

        // Dialog box
        this.pos = 0;
        this.textFrame = 0;
        this.text = "";
        this.fullText = "Welcome to my shop !\nI hope we can do business together...\nI smell fresh slaves !"
        this.bitmapText = this.add.bitmapText(180, 55, 'EquipmentPro', '', 12).setOrigin(0);

        // Choices
        for (let i = 0; i < 4; i++) {
            this.add.bitmapText(114, 160 + 32 * i, 'EquipmentPro', 'Upgrade motor (-3 crew)', 12).setOrigin(0);
            this.add.bitmapText(114 + 256, 160 + 32 * i, 'EquipmentPro', 'Downgrade motor (+2 crew)', 12).setOrigin(0);
        }
        this.add.bitmapText(114, 160 + 32 * 4, 'EquipmentPro', 'Leave shop', 12).setOrigin(0);
        this.add.bitmapText(114 + 256, 160 + 32 * 4, 'EquipmentPro', 'Remaining crew : 10', 12).setOrigin(0);

        // Cursor
        this.cursor = [0, 0];
        this.cursorText = this.add.bitmapText(114 - 24, 160, 'EquipmentPro', '->', 12).setOrigin(0);
        this.cooldown = 0;

        // Keyboard
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.transition = new Transition(this);
        this.transition.in();

        // Game progress
        if (!this.game.progress.firstShopVisit[0]) {
            this.game.progress.firstShopVisit = [true, true];
        }
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
                    this.scene.start("Diary");
                }
                break;

            default:
                this.updateText();

                if (!this.cooldown) {
                    this.cooldown = 8;
                    if (this.cursors.down.isDown) {
                        this.cursor[1] = mod(this.cursor[1] + 1, 5);
                    } else if (this.cursors.up.isDown) {
                        this.cursor[1] = mod(this.cursor[1] - 1, 5);
                    } else if (this.cursors.left.isDown) {
                        this.cursor[0] = mod(this.cursor[0] - 1, 2);
                    } else if (this.cursors.right.isDown) {
                        this.cursor[0] = mod(this.cursor[0] + 1, 2);
                    }
                    this.cursorText.x = 114 - 24 + 256 * this.cursor[0];
                    this.cursorText.y = 160 + 32 * this.cursor[1];
                } else {
                    this.cooldown--;
                }

                if (this.keySpace.isDown) {
                    if (this.cursor[0] == 0 && this.cursor[1] == 4) {
                        this.gState = GameState.TRANSITION_OUT;
                        this.transition.out();
                    } else {
                        this.game.progress.boughtSomething = true;
                    }
                }

                break;
        }

    }

    updateText() {
        this.textFrame = this.textFrame + 1;
        if (this.textFrame == this.TEXT_SPEED) {
            this.textFrame = 0;
            if (this.pos < this.fullText.length) {
                let newChar = this.fullText.charAt(this.pos);
                this.text += newChar;
                switch (newChar) {
                    case '.':
                    case '!':
                        this.textFrame = -2 * this.TEXT_SPEED;
                        break;
                    case '\n':
                        this.textFrame = -this.TEXT_SPEED;
                        break;
                }
                this.bitmapText.text = this.text;
                this.pos++;
            }
        }
    }

}