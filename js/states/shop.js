class Shop extends Phaser.Scene {

    constructor() {
        super('Shop');
        this.NAMES = ['Motor', 'Damage', 'Cadency', 'Shots No.'];
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
        this.TAUNTS = [
            "Still thinking about\ngiving away your crew\nhuh ?",
            "I do not accept the\nwounded and sick !",
            "Don't think, just take it !",
            "This guy looks handsome,\nI could make you a\nprice for him ;)",
            "Look at all these weapons,\njust for you ;o",
            "I have a lot to offer...\nIf you pay the price !",
            "Seems like you have too\nmany people here ;)",
            "Wanna let some of your\nmen go ?",
            "I'll take care of these\nones for you...",
            "Half price on this cannon!\nHuh, just kidding...",
            "I hope we can do business\ntogether...\nI smell fresh slaves !"
        ];
        this.cursor;
        this.cursorSprite;
        this.cooldown;

        this.remainingCrew;
        this.cost;
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
        this.fullText = "Welcome to my shop !\n" + this.TAUNTS[Math.floor(Math.random() * this.TAUNTS.length)];
        this.bitmapText = this.add.bitmapText(440, 240, 'EquipmentPro', '', 12).setOrigin(0);

        // Choices
        this.upgrade = [];
        this.downgrade = [];
        for (let i = 0; i < 4; i++) {
            this.upgrade.push(this.add.bitmapText(89, 183 + 32 * i, 'EquipmentPro', this.NAMES[i] + ' UP', 12).setOrigin(0.5, 0));
            this.downgrade.push(this.add.bitmapText(296, 183 + 32 * i, 'EquipmentPro', this.NAMES[i] + ' DOWN', 12).setOrigin(0.5, 0));
        }
        this.add.bitmapText(89, 353, 'EquipmentPro', 'Leave shop', 12).setOrigin(0.5);
        this.remainingCrew = this.add.bitmapText(527, 352, 'EquipmentPro', 'Remaining crew : 10', 12).setOrigin(0.5);
        this.cost = this.add.bitmapText(88, 86, 'EquipmentPro', '- 3 crew members').setOrigin(0.5);

        // Cursor
        this.cursor = [0, 0];
        this.cursorSprite = this.add.sprite(91, 180, 'shopCursor').setOrigin(0.5, 0);
        this.cooldown = 0;

        // Keyboard
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.transition = new Transition(this);
        this.transition.in();

        // Game progress
        if (!this.game.progress.firstShopVisit[0]) {
            this.game.progress.firstShopVisit = [true, false];
        }
    }

    update() {
        this.updateTexts();

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
                    if (!this.game.progress.shopDiary) {
                        this.game.progress.shopDiary = true;
                        this.scene.start("Diary");
                    } else {
                        this.scene.start("Planets");
                    }
                }
                break;

            default:
                this.updateText();
                this.cooldown = !this.cooldown ? 0 : this.cooldown - 1;

                if (!this.cooldown) {
                    this.cooldown = 15;
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
                    this.cursorSprite.x = 91 + 207 * this.cursor[0];
                    this.cursorSprite.y = 180 + 32 * this.cursor[1];
                    if (this.cursor[1] == 4) {
                        this.cursorSprite.y = 180 + 32 * (this.cursor[1] + 1);
                    }
                    this.updateTexts();

                    if (this.keySpace.isDown) {
                        if (this.cursor[0] == 0 && this.cursor[1] == 4) {
                            this.gState = GameState.TRANSITION_OUT;
                            this.transition.out();
                        } else {
                            switch (this.cursor[0]) {
                                case 0:
                                    let c1 = this.game.progress.upgradeCost(this.game.progress.statsLevel[this.cursor[1]]);
                                    if (c1 != -1 && this.game.progress.crew > c1) {
                                        this.game.progress.statsLevel[this.cursor[1]]++;
                                        this.game.progress.crew -= c1;
                                        this.game.progress.boughtSomething = true;
                                    }
                                    break;
                            
                                case 1:
                                    let c2 = this.game.progress.downgradeCost(this.game.progress.statsLevel[this.cursor[1]]);
                                    if (c2 != -1) {
                                        this.game.progress.statsLevel[this.cursor[1]]--;
                                        this.game.progress.crew += c2;
                                        this.game.progress.releasedSlaves = true;
                                    }
                                    break;
                            }
                        }
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

    updateTexts() {
        let i = this.cursor[1];
        let statLevel = this.game.progress.statsLevel[i];
        
        switch (this.cursor[0]) {
            case 0:
                var c = this.game.progress.upgradeCost(statLevel);
                if (c == -1) {
                    this.cost.text = "Impossible";
                } else {
                    this.cost.text = "- " + c + " crew members";
                }
                if (i == 4) {
                    this.cost.text = "Leave now ?";
                }
                break;
                
            case 1:
                var c = this.game.progress.downgradeCost(statLevel);
                if (c == -1) {
                    this.cost.text = "Impossible";
                } else {
                    this.cost.text = "+ " + c + " crew members";
                }
                break;
        }

        for (let j = 0; j < 4; j++) {
            var c1 = this.game.progress.upgradeCost(this.game.progress.statsLevel[j]);
            if (c1 == -1) {
                this.upgrade[j].alpha = 0.5;
            } else {
                this.upgrade[j].alpha = 1;
            }
            var c2 = this.game.progress.downgradeCost(this.game.progress.statsLevel[j]);
            if (c2 == -1) {
                this.downgrade[j].alpha = 0.5;
            } else  {
                this.downgrade[j].alpha = 1;
            }
        }

        this.remainingCrew.text = "Remaining crew : " + this.game.progress.crew;
    }

}