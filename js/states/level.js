class Level extends Phaser.Scene {

    constructor() {
        super('Level');
        this.LEVEL_BGM = ['easy', 'medium', 'hard', 'medium', 'easy', 'hard'];

        this.levelId;
        this.starfield;
        this.gState;
        this.transition;

        this.speed;
        this.targetSpeed;

        // GUI
        this.crew;

        this.bgm;

        // Tilemap objects
        this.map;
        this.victoryX;
        this.speedModif;
        this.mapObjects;
        this.mapEnemies;
        this.mapBonus;

        // Sprite Groups
        this.playerLasers;
        this.enemiesLasers;
        this.enemiesSprite;
        this.bonusSprite;
    }

    init(data) {
        this.levelId = data.id;
    }

    create() {
        this.gState = GameState.TRANSITION_IN;
        this.speed = 30;
        this.targetSpeed = 30;
        this.starfield = new Starfield(this);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.bgm = this.sound.add(this.LEVEL_BGM[this.levelId]);
        this.bgm.setVolume(mute ? 0 : 0.75);
        this.bgm.setLoop(true);
        this.bgm.play();

        this.player = new Player(
            this,
            WIDTH / 6,
            HEIGHT / 2,
            "ship"
        );


        // Tilemap loading
        this.map = this.make.tilemap({ key: 'map' + (this.levelId + 1) });

        var mapObjects = this.map.getObjectLayer("objects").objects;
        this.speedModif = [];
        this.mapEnemies = [];
        this.mapBonus = [];
        mapObjects.forEach(obj => {
            if (obj.gid < 5) {
                // Speed modifiers
                this.speedModif.push(obj);
            } else if (obj.gid >= 5 && obj.gid < 11) {
                this.mapEnemies.push(obj);
            } else {
                this.mapBonus.push(obj);
            }
        });
        this.speedModif.sort(function (a, b) { return a.x - b.x });
        this.mapEnemies.sort(function (a, b) { return a.x - b.x });
        this.mapBonus.sort(function (a, b) { return a.x - b.x });

        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, HEIGHT);
        this.victoryX = this.map.widthInPixels - WIDTH;

        this.playerLasers = this.add.group();
        this.enemiesLasers = this.add.group();
        this.enemiesSprite = this.add.group();
        this.bonusSprite = this.add.group();

        this.physics.add.overlap(this.enemiesSprite, this.playerLasers, this.touchEnemy, null, this);
        this.physics.add.overlap(this.player, this.enemiesLasers, this.getHit, this.canTouchEnemy, this);
        this.physics.add.overlap(this.player, this.bonusSprite, this.collectBonus, null, this);
        this.physics.add.collider(this.player, this.enemiesSprite, this.getHit, this.canTouchEnemy, this);

        // GUI
        this.crew = this.add.bitmapText(64, 0, 'EquipmentPro', "Crew : " + this.game.progress.crew, 24).setOrigin(0).setScrollFactor(0);

        this.transition = new Transition(this);
        this.transition.in();

    }

    update() {
        this.updateSpeed();
        this.updateEnemies();
        this.updateBonus();
        this.starfield.scroll(2 * this.speed + 1);

        switch (this.gState) {
            case GameState.TRANSITION_IN:
                if (this.transition.ended) {
                    // End of the opening transition
                    this.gState = GameState.MAIN;
                    this.transition.ended = false;
                }
                break;

            case GameState.WINNING_STATE:
                if (this.player.x > this.victoryX + 128) {
                    this.gState = GameState.TRANSITION_OUT;
                    this.transition.out();
                }
                break;

            case GameState.TRANSITION_OUT:
                this.bgm.volume = Math.max(0, this.bgm.volume - 0.015);
                if (this.transition.ended) {
                    this.bgm.stop();
                    this.resetScene();
                    this.game.progress.visited[this.levelId] = true;
                    this.scene.start("Diary");
                    return false;
                }
                break;

            default:
                // Player x movement
                if (this.cursors.up.isDown && this.player.y > 18) {
                    this.player.moveY(-1);
                } else if (this.cursors.down.isDown && HEIGHT - this.player.y > 18) {
                    this.player.moveY(1);
                } else {
                    this.player.stopY();
                }

                // Player y movement
                if (this.cursors.left.isDown && this.player.x > this.cameras.main.scrollX + 32) {
                    this.player.moveX(-1);
                } else if (this.cursors.right.isDown && this.player.x < this.cameras.main.scrollX + WIDTH - 32) {
                    this.player.moveX(1);
                } else {
                    this.player.stopX();
                }

                this.player.isShooting = this.cursors.space.isDown;
                this.player.update()
                break;
        }

        this.cameras.main.scrollX += this.speed;
        this.player.x += this.speed;

        this.playerLasers.getChildren().forEach(laser => {
            laser.x += this.speed;
        });

        this.playerLasers.getChildren().forEach(laser => {
            if (laser.x > this.cameras.main.scrollX + WIDTH + 16) {
                this.playerLasers.remove(laser, true, true);
            }
        });

        this.enemiesLasers.getChildren().forEach(laser => {
            if (laser.x < this.cameras.main.scrollX - 16) {
                this.enemiesLasers.remove(laser, true, true);
            }
        });

        this.enemiesSprite.getChildren().forEach(enemy => {
            enemy.update();
        });

        this.enemiesSprite.getChildren().forEach(enemy => {
            if (enemy.x < this.cameras.main.scrollX - 16) {
                this.enemiesSprite.remove(enemy, true, true);
            }
        });

        this.bonusSprite.getChildren().forEach(bonus => {
            bonus.update();
        });

        // Winning condition
        if (this.player.x > this.victoryX && this.gState == GameState.MAIN) {
            this.gState = GameState.WINNING_STATE;
            this.player.setVelocityX(300);
            this.player.isShooting = false;
        }

    }

    resetScene() {
        this.speedModif = [];
        this.starfield.destroy();
        this.player.destroy();
    }

    // Change the speed if the player moves beyond this.speedModif[0]
    updateSpeed() {
        if (this.speedModif.length && this.speedModif[0].x < this.player.x) {
            var sM = this.speedModif.shift();
            var speed = (sM.gid - 1) * 2;
            this.targetSpeed = speed;
        }

        if (this.speed < this.targetSpeed) {
            this.speed += 1;
            this.updateBodies();
        } else if (this.speed > this.targetSpeed) {
            this.speed -= 1;
            this.updateBodies();
        }
    }

    updateBodies() {
        this.player.body.offset.x = this.speed;
        this.playerLasers.getChildren().forEach(laser => {
            laser.body.offset.x = this.speed;
        });
        this.enemiesLasers.getChildren().forEach(laser => {
            laser.body.offset.x = this.speed;
        });
    }

    // Transform this.mapEnemies objects into Sprite objects when they are close to the screen
    updateEnemies() {
        if (this.mapEnemies.length && this.mapEnemies[0].x < this.cameras.main.scrollX + WIDTH + 32) {
            let foe = this.mapEnemies.shift();
            let level = parseInt(0 + foe.type, 10);

            switch (foe.gid) {
                case 5:
                    var enemy = new Chaser(this, foe.x, foe.y, level);
                    break;
                case 6:
                    var enemy = new Cargo(this, foe.x, foe.y, level);
                    break;
                case 7:
                    var enemy = new Gunner(this, foe.x, foe.y, level);
                    break;
                case 8:
                    var enemy = new DualShooter(this, foe.x, foe.y, level);
                    break;
                case 9:
                    var enemy = new FixedShooter(this, foe.x, foe.y, level);
                    break;
                case 10:
                    var enemy = new Cargo2(this, foe.x, foe.y, level);
                    break;
            }
            this.enemiesSprite.add(enemy)
        }
    }

    // Transform this.mapBonus objects into Bonus objects when they are close to the screen
    updateBonus() {
        if (this.mapBonus.length && this.mapBonus[0].x < this.cameras.main.scrollX + WIDTH + 32) {
            let obj = this.mapBonus.shift();
            var b = new Bonus(this, obj.x, obj.y);
            this.bonusSprite.add(b);
        }
    }

    // Condition for the player to take a hit
    canTouchEnemy(player, x) {
        return player.invincibility == 0;
    }

    // Called when the player overlaps with a laser and isn't invincible
    getHit(player, enemy) {
        if (this.game.progress.crew > 0) {
            this.game.progress.crew -= 1;
            player.invincibility = 60;
            this.crew.text = "Crew : " + this.game.progress.crew;
            if (this.game.progress.crew == 0) {
                this.gState = GameState.TRANSITION_OUT;
                this.transition.out();
            }
        }
        enemy.destroy();
    }

    // Overlap callback when a laser touches an enemy
    touchEnemy(enemy, laser) {
        laser.destroy();
        enemy.life -= this.game.progress.damage;;
        if (enemy.life == 0) {
            enemy.destroy();
        }
    }

    // Called when the player collects a bonus
    collectBonus(player, bonus) {
        bonus.destroy();
        this.game.progress.crew += 1;
        this.crew.text = "Crew : " + this.game.progress.crew;
    }
}