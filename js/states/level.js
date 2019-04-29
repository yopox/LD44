class Level extends Phaser.Scene {

    constructor() {
        super('Level');
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

        // Sprite Groups
        this.playerLasers;
        this.enemiesLasers;
        this.enemiesSprite;
    }

    create() {
        this.gState = GameState.TRANSITION_IN;
        this.speed = 30;
        this.targetSpeed = 30;
        this.starfield = new Starfield(this);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.bgm = this.sound.add('hard');
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
        this.map = this.make.tilemap({ key: 'map' });

        var mapObjects = this.map.getObjectLayer("objects").objects;
        this.speedModif = [];
        this.mapEnemies = [];
        mapObjects.forEach(obj => {
            if (obj.gid < 5) {
                // Speed modifiers
                this.speedModif.push(obj);
            }
            else if (obj.gid >= 5) {
                this.mapEnemies.push(obj)
            }
        });
        this.speedModif.sort(function (a, b) { return a.x - b.x });
        this.mapEnemies.sort(function (a, b) { return a.x - b.x });
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, HEIGHT);
        this.victoryX = this.map.widthInPixels - 256;

        this.playerLasers = this.add.group();
        this.enemiesLasers = this.add.group();
        this.enemiesSprite = this.add.group();

        this.physics.add.overlap(this.enemiesSprite, this.playerLasers, this.touchEnemy, null, this);
        this.physics.add.overlap(this.player, this.enemiesLasers, this.getHit, this.canTouchEnemy, this);
        this.physics.add.collider(this.player, this.enemiesSprite, this.getHit, this.canTouchEnemy, this);

        // GUI
        this.crew = this.add.bitmapText(64, 0, 'EquipmentPro', "Crew : " + this.game.progress.crew, 24).setOrigin(0).setScrollFactor(0);

        this.transition = new Transition(this);
        this.transition.in();

    }

    update() {
        this.updateSpeed();
        this.updateEnemies()
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
                    this.scene.start("Diary");
                    return false;
                }
                break;

            default:
                if (this.cursors.up.isDown && this.player.y > 18) {
                    this.player.moveUp();
                }
                else if (this.cursors.down.isDown && HEIGHT - this.player.y > 18) {
                    this.player.moveDown();
                }
                else {
                    this.player.stopY();
                }
                if (this.cursors.left.isDown && this.player.x > this.cameras.main.scrollX + 32) {
                    this.player.moveLeft();
                }
                else if (this.cursors.right.isDown && this.player.x < this.cameras.main.scrollX + WIDTH - 32) {
                    this.player.moveRight();
                }
                else {
                    this.player.stopX();
                }
                if (this.cursors.space.isDown) {
                    this.player.isShooting = true;

                }
                else {
                    this.player.isShooting = false;
                }
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
            if (laser.x > this.cameras.main.scrollX + WIDTH + 16) {
                this.enemiesLasers.remove(laser, true, true);
            }
        });

        this.enemiesSprite.getChildren().forEach(enemy => {
            enemy.update();
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

    updateEnemies() {

        if (this.mapEnemies.length && this.mapEnemies[0].x < this.cameras.main.scrollX + WIDTH + 64) {
            var foe = this.mapEnemies.shift();
            let level = parseInt(0+foe.type, 10);
            switch (foe.gid) {
                case 5:
                    var enemy = new Chaser(this, foe.x, foe.y, level);
                    break;
                case 6:
                    var enemy = new Cargo(this, foe.x, foe.y, level);
                    break;
                case 7:
                    var enemy = new Gunner(this, foe.x, foe.y, level);
                    console.log(foe);
                    
                    break;
            }
            this.enemiesSprite.add(enemy)
        }

    }

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

    canTouchEnemy(player, x) {
        return player.invincibility == 0;
    }

    touchEnemy(enemy, laser) {
        laser.destroy();
        enemy.life -= this.game.progress.damage;;
        if (enemy.life == 0) {
            enemy.destroy();
        }

    }
}