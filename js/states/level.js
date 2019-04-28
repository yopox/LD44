class Level extends Phaser.Scene {

    constructor() {
        super('Level');
        this.starfield;
        this.gState;
        this.transition;
        this.speed;
        this.targetSpeed;
        this.map;
        this.speedModif;
        this.victoryX;
        this.crew;
    }

    create() {
        this.gState = GameState.TRANSITION_IN;
        this.speed = 30;
        this.targetSpeed = 30;
        this.starfield = new Starfield(this);
        this.cursors = this.input.keyboard.createCursorKeys();
        
        this.player = new Player(
            this,
            WIDTH / 6,
            HEIGHT / 2,
            "ship"
        );
        console.log(this.player);
    

        // Tilemap loading
        this.map = this.make.tilemap({ key: 'map' });

        var mapObjects = this.map.getObjectLayer("objects").objects;
        this.speedModif = [];
        this.enemiesTiled = [];
        mapObjects.forEach(obj => {
            if (obj.gid < 5) {
                // Speed modifiers
                this.speedModif.push(obj);
            }
            else if (obj.gid == 5) {
                this.enemiesTiled.push(obj)
            }
        });
        this.speedModif.sort(function (a, b) { return a.x - b.x });
        this.enemiesTiled.sort(function (a, b) { return a.x - b.x });
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, HEIGHT);
        this.victoryX = this.map.widthInPixels - 256;

        // GUI
        this.crew = this.add.bitmapText(64, 0, 'EquipmentPro', "Crew : " + this.game.progress.crew, 24).setOrigin(0).setScrollFactor(0);
        
        this.transition = new Transition(this);
        this.transition.in();

        this.playerLasers = this.add.group();
        this.enemiesSprite = this.add.group();
        this.physics.add.overlap(this.enemiesSprite, this.playerLasers, function(foe, laser) {
            foe.destroy();
        });

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
                if (this.transition.ended) {
                    this.resetScene();
                    this.scene.start("Title");
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
            var speed = (sM.gid - 1) * 4;
            console.log("new speed : " + speed);
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
    }

    updateEnemies() {

        if (this.enemiesTiled.length && this.enemiesTiled[0].x < this.player.x + 2 * WIDTH) {
            // console.log(this.enemiesTiled[0].x)
            var enemyBeam = this.enemiesTiled.shift();

            if (enemyBeam.gid == 5) {
                var enemy = new Pizza(
                    this,
                    enemyBeam.x,
                    enemyBeam.y
                );

                this.enemiesSprite.add(enemy)
            }
        }
    }
}