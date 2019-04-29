class Shop extends Phaser.Scene {

    constructor() {
        super('Shop');
        this.NAMES = ['Motor', 'Cadency', 'Damage', 'Shots No.'];
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
        this.cursorSprite;
        this.cooldown;

        this.remainingCrew;
        this.upgrade;
        this.downgrade;

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
        this.fullText = "Welcome to my shop !\nI hope we can do business\ntogether...\nI smell fresh slaves !"
        this.bitmapText = this.add.bitmapText(432, 240, 'EquipmentPro', '', 12).setOrigin(0);

        // Choices
        this.upgrade = [];
        this.downgrade = [];
        for (let i = 0; i < 4; i++) {
            this.upgrade.push(this.add.bitmapText(89, 183 + 32 * i, 'EquipmentPro', this.NAMES[i] + ' UP', 12).setOrigin(0.5, 0));
            this.downgrade.push(this.add.bitmapText(296, 183 + 32 * i, 'EquipmentPro', this.NAMES[i] + ' DOWN', 12).setOrigin(0.5, 0));
        }
        this.add.bitmapText(89, 353, 'EquipmentPro', 'Leave shop', 12).setOrigin(0.5);
        this.remainingCrew = this.add.bitmapText(527, 352, 'EquipmentPro', 'Remaining crew : 10', 12).setOrigin(0.5);

        // Cursor
        this.cursor = [0, 0];
        this.cursorSprite = this.add.sprite(89, 180, 'shopCursor').setOrigin(0.5, 0);
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
                        if (this.cursor[0] == 1 && this.cursor[1] == 4) {
                            this.cursor[1] = 3;
                        }
                    } else if (this.cursors.up.isDown) {
                        this.cursor[1] = mod(this.cursor[1] - 1, 5);
                        if (this.cursor[0] == 1 && this.cursor[1] == 4) {
                            this.cursor[1] = 0;
                        }
                    } else if (this.cursors.left.isDown) {
                        this.cursor[0] = mod(this.cursor[0] - 1, 2);
                        if (this.cursor[0] == 1 && this.cursor[1] == 4) {
                            this.cursor[0] = 0;
                        }
                    } else if (this.cursors.right.isDown) {
                        this.cursor[0] = mod(this.cursor[0] + 1, 2);
                        if (this.cursor[0] == 1 && this.cursor[1] == 4) {
                            this.cursor[0] = 0;
                        }
                    }
                    this.cursorSprite.x = 89 + 207 * this.cursor[0];
                    this.cursorSprite.y = 180 + 32 * this.cursor[1];
                    if (this.cursor[1] == 4) {
                        this.cursorSprite.y = 180 + 32 * (this.cursor[1] + 1);
                    }
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